void function () {
	'use strict';

	const express = require('express'), app = express();
	const bodyParser = require('body-parser');

	const PORT = process.env.PORT || 3000;
	const HOT_RELOAD_PORT = process.env.HOT_RELOAD_PORT || 3080;
	const DIST = require('path').resolve(process.env.DIST || 'dist');
	console.log('port:', PORT, 'hot-reload-port:', HOT_RELOAD_PORT, 'dist:', DIST);

	const context = {port: PORT, hot_reload_port: HOT_RELOAD_PORT, dist: DIST};
	console.log(context);

	// ボディーパーサー
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));

	// XYZ API
	app.use('/xyz/api', require('./xyz-api')(context));

	// 静的ファイルとディレクトリ一覧
	const onRequest = require('./web-serve-dist-hot-reload')(context);
	app.use(onRequest);
	// Hot Reload Service
	onRequest.hotReloadService(context);

	// ポートでサービス開始
	const server = app.listen(PORT, function () {
		const port = server.address().port;
		console.log('Example app listening at http://localhost:%s', port);
	});
}();
