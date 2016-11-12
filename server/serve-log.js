void function () {
	'use strict';

	const http = require('http');

	module.exports = serveLog;

	function serveLog(req, res, next) {
		const start = process.hrtime(); // 開始時刻
		let len = 0;
		const url = req.url;

		// res.write(buf)
		res.write = (write => function (buf) { // 終了時にログ出力
			len += buf.length;
			write.apply(this, arguments);
		}) (res.write);

		// res.end([buf])
		res.end = (end => function (buf) { // 終了時にログ出力
			if (buf && buf.length) len += buf.length;
			const delta = process.hrtime(start); // 時刻の差

			let msg = res.statusCode + ' ';
			if (res.statusCode < 300) msg = msg.green;
			else if (res.statusCode < 400) msg = msg.cyan;
			else msg = msg.red;

			let t = delta[0] * 1e3 + delta[1] / 1e6, time = t.toFixed(3) + ' msec';
			if (t < 10) time = '  ' + time.green;
			else if (t < 100) time = ' ' + time.yellow;
			else time = time.red;

			msg = msg + time + (' -' +
				('     ' + (len / 1e3).toFixed(3)).substr(-9) + ' KB ' +
				res.statusCode + ' ' +
				http.STATUS_CODES[res.statusCode] + ' - ').gray +
				req.method + ' ' + url;

			console.log(msg);
			//console.log(req);
			//console.log(res);

			end.apply(this, arguments);
		}) (res.end);

		next();
	}

} ();
