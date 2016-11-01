module.exports = function (context) {
	const router = require('express').Router();

	router.use('/books', require('./xyz-api-books')(context));
	router.use('/users', require('./xyz-api-users')(context));

	return router;
};
