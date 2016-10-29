'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');
//const aa = require('aa');
const aa = gen => function cb(err, val) {
	const obj = err ? gen.throw(err) : gen.next(val);
	obj.done || obj.value(cb); } ();
aa.callback = gfn => (req, res) => aa(gfn(req, res));

const PORT = process.env.PORT || 3000;
const DIST = path.resolve(process.env.DIST || 'dist');
console.log('port:', PORT, 'dist:', DIST);

const HOT_RELOAD_PORT = process.env.HOT_RELOAD_PORT || 3080;
const HOT_RELOAD_SCRIPT = '<div id="hotReloadDiv"><a href="/">home</a> / <a href=".">cur</a>'+
	'<span id="hotReloadSpan"></span></div>' +
	'<script>setTimeout(function x(){"use strict";' +
	'var s,T=setTimeout,t,l=location,h=hotReloadDiv;' +
	'try{s=new WebSocket("ws://localhost:' + HOT_RELOAD_PORT + '");}catch(e){}' +
	's.onopen=function(){t&&clearTimeout(t);t=0;h.style.backgroundColor="lightgreen";hotReloadSpan.innerHTML=" " + new Date().toLocaleTimeString()};' +
	's.onclose=function(){h.style.backgroundColor="lightgray";t=T(x,3000)};' +
	's.onmessage=function(){l.href=l.href};' +
	'h.style.backgroundColor="lightgray";' +
	//'hotReloadSpan.innerHTML=" " + new Date().toLocaleTimeString();' +
	'},0);</script>';

const TYPES = {
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.xml': 'text/xml',
	'.ico': 'image/x-icon',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.html': 'text/html; charset=UTF-8'};
const DEFAULTS = ['index.html', 'index.htm', 'default.html'];

http.createServer(aa.callback(function *(req, res) {
	const start = process.hrtime(); // 開始時刻
	res.end = (end => function () { // 終了時にログ出力
		const delta = process.hrtime(start); // 時刻の差
		console.log('%d', res.statusCode,
			(delta[0] * 1e3 + delta[1] / 1e6).toFixed(3), 'msec',
			req.method, req.url);
		end.apply(this, arguments);
	}) (res.end);

	const file = path.join(DIST, req.url); // 実際のファイル名
	if (!file.startsWith(DIST)) // 悪意のある要求は除外
		return resError(418, new Error('malicious? ' + req.url));

	let stat;
	try { stat = yield cb => fs.stat(file, cb); // ファイルの状態?
	} catch (err) { return resError(404, err); } // エラー

	try {
		if (stat.isDirectory()) { // ディレクトリの場合
			// URLが'/'で終わっていない時はリダイレクトさせる
			if (!req.url.endsWith('/'))
				return resRedirect(301, req.url + '/');

			yield *resDir(file); // ディレクトリ一覧
		} else resFile(file); // ファイルの場合ファイルを応答
	} catch (err) { return resError(500, err); }

	function resFile(file) { // ファイルを応答
		const ext = path.extname(file);
		res.writeHead(200, {'content-type': TYPES[ext] || 'text/plain'});
		fs.createReadStream(file).on('error', resError)
			.on('end', () => res.end(ext !== '.html' ? undefined: HOT_RELOAD_SCRIPT))
			.pipe(res, {end:false});
	}

	function *resDir(dir) { // ディレクトリ一覧
		const names = yield cb => fs.readdir(dir, cb);
		for (let name of DEFAULTS)
			if (names.indexOf(name) >= 0)
				return resFile(file + name);
		res.writeHead(200, {'content-type': 'text/html'});
		res.end('Directory: ' + req.url + '<br>\n' + names.map(x =>
			'<a href="' + x + '">' + x + '</a><br>\n').join('') + HOT_RELOAD_SCRIPT);
	}

	function resRedirect(code, loc) { // リダイレクトさせる
		res.writeHead(code, {location: loc});
		res.end(code + ' ' + http.STATUS_CODES[code] + '\n' + loc);
	}

	function resError(code, err) { // エラー応答
		const msg = (err + '').replace(DIST, '*');
		console.error(msg);
		if (code instanceof Error) err = code, code = 500;
		res.writeHead(code, {'content-type': 'text/html'});
		res.end('<h2>' + code + ' ' + http.STATUS_CODES[code] + '</h2>\n' +
			'<h3>' + msg + '</h3>\n' + HOT_RELOAD_SCRIPT);
	}

})).listen(PORT, () => {
	process.on('uncaughtException', err =>
		console.log(err + (err.filename ? ' file: ' + err.filename : '')));

	// hot reload service
	let list = [];
	const RELOAD = () => list.forEach(s => s.send('reload'));
	let timer = setTimeout(RELOAD, 5000);
	const ws = new (require('ws').Server)({port: HOT_RELOAD_PORT});
	ws.on('connection', s =>
		list.push(s.on('close', () => list = list.filter(x => x !== s))));
	require('gulp').watch(DIST + '/**', () => {
		timer && clearTimeout(timer);
		timer = setTimeout(RELOAD, 1000);
	});
}); // ポートをListenする
