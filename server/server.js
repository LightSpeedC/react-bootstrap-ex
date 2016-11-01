void function () {
	'use strict';

	const express = require('express'), app = express();
	const serveIndex = require('serve-index');
	const bodyParser = require('body-parser');

	const context = {};

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({extended: false}));

	//======================================================
	app.use('/xyz/api', require('./xyz-api')(context));

	//======================================================
	app.use(express.static(process.env.DIST || '.'));
	app.use(serveIndex(process.env.DIST || '.', {icons: true}));

	//======================================================
	const server = app.listen(process.env.PORT || 3000, function () {
		const port = server.address().port;
		console.log('Example app listening at http://localhost:%s', port);
	});
}();
