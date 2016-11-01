void function () {
	'use strict';

	const express = require('express'), app = express();
	const serveIndex = require('serve-index');
	const bodyParser = require('body-parser');

	const context = {};

	// ボディーパーサー
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));

	// XYZ API
	app.use('/xyz/api', require('./xyz-api')(context));

	// 静的ファイルとディレクトリ一覧
	app.use(express.static(process.env.DIST || '.'));
	app.use(serveIndex(process.env.DIST || '.', {icons: true}));

	// ポートでサービス開始
	const server = app.listen(process.env.PORT || 3000, function () {
		const port = server.address().port;
		console.log('Example app listening at http://localhost:%s', port);
	});
}();
