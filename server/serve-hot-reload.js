module.exports = function (dir, context) {
	'use strict';

	const http = require('http');
	const path = require('path');
	const fs = require('fs');

	//const aa = require('aa');
	//const aa = require('../src/js/aa-pico');
	/*
	const aa = gen => function cb(err, val) {
		const obj = err ? gen.throw(err) : gen.next(val);
		obj.done || (obj.value)(cb); } ();
	aa.callback = gfn => (req, res, next) => aa(gfn(req, res, next));
	*/
	const array2thunk = arr => cb => {
		let n = arr.length, res = new Array(n);
		arr.forEach((f, i) => f((e, v) => (
			e ? n > 0 && (cb(e), n = 0) :
			res[i] = v, --n || cb(null, res)))); };
	const aa = gen => cb => function next(err, val) {
		try {
			const obj = err ? gen.throw(err) : gen.next(val);
			val = obj.value;
			obj.done ? cb && cb(null, val) :
			(typeof val === 'function' ?
			val : array2thunk(val))(next);
		} catch (e) { if (cb) cb(e); else throw e; }
	} ();
	aa.callback = gfn => (req, res, next) => aa(gfn(req, res, next))();

	// color
	const csi = '\x1b['; // control sequence introducer
	const colors = {
		black: csi + '30m', red: csi + '31m', green: csi + '32m',
		yellow: csi + '33m', blue: csi + '34m', magenta: csi + '35m',
		cyan: csi + '36m', white: csi + '37m', gray: csi + '90m'}
	const bgColors = {
		bgBlack: csi + '40m', bgRed: csi + '41m', bgGreen: csi + '42m',
		bgYellow: csi + '43m', bgBlue: csi + '44m', bgMagenta: csi + '45m',
		bgCyan: csi + '46m', bgWhite: csi + '47m'};
	function defineColor(colors, reset) {
		Object.keys(colors).forEach(c => Object.defineProperty(
			String.prototype, c, {configurable: true, get:
				function () { return colors[c] + this + reset; }})); }
	defineColor(colors, csi + '39m');
	defineColor(bgColors, csi + '49m');
	defineColor({bold: csi + '1m'}, csi + '21m');
	defineColor({bgLight: csi + '5m'}, csi + '25m');

	const DIST = path.resolve(dir);
	const HOT_RELOAD_PORT = context.hot_reload_port;

	const HOT_RELOAD_SCRIPT =
		'<hr id="hotReloadId" style="height: 1px; border: none;"/>'+
		'<div id="hotReloadDiv">(<span id="hotReloadSpan">0</span>) ' +
		'<a href="#" onclick="location.href=location.href">更新</a> / ' +
		'<a href="/">ホーム■</a> / <a href="..">上▲</a> / <a href=".">ココ●</a></div>' +
		'<script>setTimeout(function x(){"use strict";' +
		'var s,T=setTimeout,t,l=location,h=hotReloadId.style,' +
		'v=hotReloadDiv.style,c=hotReloadSpan,b="backgroundColor";' +
		'try{s=new WebSocket("ws://localhost:' + HOT_RELOAD_PORT +
		'");}catch(e){return t=T(x,3000)}' +
		's.onopen=function(){t&&clearTimeout(t);t=0;v[b]=h[b]="lightgreen"};' +
		's.onclose=function(){v[b]=h[b]="lightgray";t=T(x,3000)};' +
		's.onmessage=function(e){' +
		'if(e.data.substr(0,1)==="c")c.innerHTML=e.data.substr(1);' +
		'if(e.data==="r")l.href=l.href};' +
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

	const onRequest = aa.callback(function *(req, res) {
		const start = process.hrtime(); // 開始時刻
		let len = 0;
		res.write = (write => function (buf) { // 終了時にログ出力
			len += buf.length;
			write.apply(this, arguments);
		}) (res.write);
		res.end = (end => function (buf) { // 終了時にログ出力
			if (buf && buf.length) len += buf.length;
			const delta = process.hrtime(start); // 時刻の差
			let msg = res.statusCode + ' ';
			if (res.statusCode < 300) msg = msg.green;
			else if (res.statusCode < 400) msg = msg.cyan;
			else msg = msg.red;
			let t = delta[0] * 1e3 + delta[1] / 1e6, time = t.toFixed(3) + ' msec ';
			if (t < 10) time = '  ' + time.green;
			else if (t < 100) time = ' ' + time.yellow;
			else time = time.red;
			msg = msg + time + (' - ' + res.statusCode + ' ' +
				http.STATUS_CODES[res.statusCode] + ' -' +
				('     ' + (len / 1e3).toFixed(3)).substr(-9) + ' KB ').gray +
				req.method + ' ' + req.url
			console.log(msg);
			//console.log('res.headers:', res.headers);
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
			let maxAge = 3; // 3秒
			if (req.url.startsWith('/js/') ||
				req.url.startsWith('/css/') ||
				req.url.startsWith('/favicon')) maxAge = 600; // 10分
			res.writeHead(200, {'content-type': TYPES[ext] || 'text/plain',
				'cache-control': 'max-age=' + maxAge});
			fs.createReadStream(file).on('error', resError)
				.on('end', () => res.end(ext !== '.html' ? undefined: HOT_RELOAD_SCRIPT))
				.pipe(res, {end:false});
		}

		function *resDir(dir) { // ディレクトリ一覧
			const names = yield cb => fs.readdir(dir, cb);
			for (let name of DEFAULTS)
				if (names.indexOf(name) >= 0)
					return resFile(file + name);
			res.writeHead(200, {'content-type': TYPES['.html'],
				'cache-control': 'max-age=3'});
			const results = yield names.map(name => cb =>
				fs.stat(path.join(dir, name), (e, stat) => cb(e, {name, stat})));
			res.end('Directory: ' + req.url + '<br/>\n' + results.map(x => {
				if (x.stat.isDirectory()) x.name += '/';
				return '<a href="' + x.name + '">' + x.name + '</a><br/>\n';
			}).join('') + HOT_RELOAD_SCRIPT);
		}

		function resRedirect(code, loc) { // リダイレクトさせる
			res.writeHead(code, {location: loc});
			res.end(code + ' ' + http.STATUS_CODES[code] + '\n' + loc);
		}

		function resError(code, err) { // エラー応答
			const msg = (err + '').replace(DIST, '*');
			console.error(msg.bgRed.bgLight);
			if (code instanceof Error) err = code, code = 500;
			res.writeHead(code, {'content-type': TYPES['.html'],
				'cache-control': 'max-age=3'});
			res.end('<h2>' + code + ' ' + http.STATUS_CODES[code] + '</h2>\n' +
				'<h3>' + msg + '</h3>\n' + HOT_RELOAD_SCRIPT);
		}

	}); // onRequest

	onRequest.hotReloadService = function hotReloadService(dir, context) {
		const DIST = path.resolve(dir);
		const HOT_RELOAD_PORT = context.hot_reload_port;

		process.on('uncaughtException', err =>
			console.error((err.stack + (err.filename ? '\nfile: ' + err.filename : '')).bgRed.bgLight));

		// hot reload service
		let list = [], last;
		const sendReload = () => { console.log('***   ***** dist updated - send reload');
			list.forEach(s => {
				try { s.send('r');
				} catch (e) { console.error(('reload fail: ' + e).red); }
			});
		};
		const sendCount = m => { last !== list.length && (last = list.length,
			list.forEach(s => {
				try { s.send('c' + last);
				} catch (e) { console.error(('send count fail: ' + e).red); }
			}));
			console.log(m + ('   ' + last).substr(-4) + ' conn');
		};
		let timer = setTimeout(sendReload, 3000);
		const ws = require('ws').createServer({port: HOT_RELOAD_PORT}, s => {
			list.push(s.on('close', () => {
				list = list.filter(x => x !== s);
				sendCount('ws-'.magenta);
			}).on('error', e => console.error(('s fail: ' + e).bgRed.bgLight)));
			s.send('c'+list.length);
			sendCount('ws+'.cyan);
		}).on('error', e => console.error(('ws fail: ' + e).bgRed.bgLight));
		require('gulp').watch(DIST + '/**', () => {
			timer && clearTimeout(timer);
			timer = setTimeout(sendReload, 2000);
		});

	};

	return onRequest;
};
