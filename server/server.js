void function () {
	'use strict';

	const express = require('express'), app = express();
	const bodyParser = require('body-parser');

	const dir = process.env.DIST || 'dist';
	const context = {port: process.env.PORT || 3000,
		hot_reload_port: process.env.HOT_RELOAD_PORT || 3080};
	console.log(context);

	process.title = 'server on port: ' + context.port + ', hot reload port: ' + context.hot_reload_port;

	// ログ
	app.use(require('./serve-log'));

	// ボディーパーサー
	app.set('json spaces', '  ');
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));

	// XYZ API
	app.use('/xyz/api', require('./xyz-api')(context));
	app.use('/lib/api', require('./lib-api')(context));

	// 静的ファイルとディレクトリ一覧
	const onRequest = require('./serve-hot-reload')(dir, context);
	app.use(onRequest);
	// Hot Reload Service
	onRequest.hotReloadService(dir, context);

	// ポートでサービス開始
	const server = app.listen(context.port, function () {
		const port = server.address().port;
		console.log('Example app listening at http://localhost:%s', port);
	});
}();
