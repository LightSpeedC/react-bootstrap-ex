module.exports = function (context) {
	const router = require('express').Router();

	router.use('/menus', require('./lib-api-menus')(context));

	return router;
};
