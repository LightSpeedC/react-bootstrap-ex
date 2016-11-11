module.exports = function (context) {
	const router = require('express').Router();

	const data = context.data = {list: []};
	const reduceMaxId = (a, b) => Math.max(a, b.id);

	for (let id = 0; id < 1e3; ++id)
		data.list.push({id, name: 'book' + id});

	data.nextId = data.list.reduce(reduceMaxId, 0) + 1;

	const SIZE = 10;
	const NOT_FOUND = {code: 'not_found',
			message: 'data is not found'};

	// GET /?offset=0&size=10
	router.get('/', (req, res) => {
		const offset = Number(req.query.offset || 0);
		const size = Number(req.query.size || SIZE);
		resResult(res, data.list.slice(offset, offset + size));
	});

	// GET /:id
	router.get('/:id', (req, res) => {
		const pos = getIndex(Number(req.params.id));
		if (pos < 0) return resError(res, NOT_FOUND);
		resResult(res, data.list[pos]);
	});

	// POST /
	router.post('/', (req, res) => {
		const elem = req.body;
		elem.id = data.nextId++;
		data.list.push(elem);
		resResult(res, elem);
	});

	// PUT /:id
	router.put('/:id', (req, res) => {
		const pos = getIndex(Number(req.params.id));
		if (pos < 0) return resError(res, NOT_FOUND);
		resResult(res, data.list.splice(pos, 1, req.body));
	});

	// DELETE /:id
	router.delete('/:id', (req, res) => {
		const pos = getIndex(Number(req.params.id));
		if (pos < 0) return resError(res, NOT_FOUND);
		resResult(res, data.list.splice(pos, 1));
	});

	// getIndex
	function getIndex(id) {
		const len = data.list.length;
		for (let pos = 0; pos < len; ++pos)
			if (data.list[pos].id === id)
				return pos;
		return -1;
	}

	// resResult
	function resResult(res, result) {
		res.json({result, length: data.list.length});
	}

	// resError
	function resError(res, error) {
		res.json({error, length: data.list.length});
	}

	return router;
};
