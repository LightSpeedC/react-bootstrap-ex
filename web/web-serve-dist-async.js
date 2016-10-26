'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const DIST = path.resolve(process.env.DIST || 'dist');
console.log('port:', PORT, 'dist:', DIST);

const TYPES = {
	'.js': 'text/javascript',
	'.css': 'text/css',
	'.xml': 'text/xml',
	'.ico': 'image/x-icon',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.htm': 'text/html; charset=UTF-8',
	'.html': 'text/html; charset=UTF-8'};
const DEFAULTS = ['index.html', 'index.htm', 'default.html'];

http.createServer(function onRequest(req, res) {
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

	fs.stat(file, (err, stat) => { // ファイルの状態?
		if (err) return resError(404, err); // エラー

		if (stat.isDirectory()) { // ディレクトリの場合
			// URLが'/'で終わっていない時はリダイレクトさせる
			if (!req.url.endsWith('/'))
				return resRedirect(301, req.url + '/');

			resDir(file); // ディレクトリ一覧
		} else resFile(file); // ファイルの場合ファイルを応答
	});

	function resFile(file) { // ファイルを応答
		res.writeHead(200, {'content-type':
			TYPES[path.extname(file)] || 'text/plain'});
		fs.createReadStream(file).on('error', resError).pipe(res);
	}

	function resDir(dir) { // ディレクトリ一覧
		fs.readdir(dir, (err, names) => {
			if (err) return resError(500, err);
			for (let name of DEFAULTS)
				if (names.indexOf(name) >= 0)
					return resFile(file + name);
			res.writeHead(200, {'content-type': 'text/html'});
			res.end('Directory: ' + req.url + '<br>\n' + names.map(x =>
				'<a href="' + x + '">' + x + '</a><br>').join('\n'));
		});
	}

	function resRedirect(code, loc) { // リダイレクトさせる
		res.writeHead(code, {location: loc});
		res.end(code + ' ' + http.STATUS_CODES[code] + '\n' + loc);
	}

	function resError(code, err) { // エラー応答
		const msg = (err + '').replace(DIST, '*');
		console.error(msg);
		if (code instanceof Error) err = code, code = 500;
		res.writeHead(code, {'content-type': 'text/plain'});
		res.end(code + ' ' + http.STATUS_CODES[code] + '\n' + msg);
	}

}).listen(PORT); // ポートをListenする
