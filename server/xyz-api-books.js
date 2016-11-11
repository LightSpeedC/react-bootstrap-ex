module.exports = function (context) {
	const data = {list: [{id:0,name:'book0'}, {id:1,name:'book1'}]};
	const maxId = (a, b) => Math.max(a, b.id);
	data.id = data.list.reduce(maxId, 0) + 1;
	context.data = data;

	for (let id = data.id; id < 1e3; ++id)
		data.list.push({id, name: 'book' + id});
	data.id = data.list.reduce(maxId, 0) + 1;
	const SIZE = 10;

	const router = require('express').Router();

	const NOT_FOUND = {code: 'not_found',
					message: 'data is not found'};

	router.get('/', (req, res) => {
		const offset = Number(req.query.offset || 0);
		const size = Number(req.query.size || SIZE);
		resResult(res, data.list.slice(offset, offset + size));
	});

	router.get('/:id', (req, res) => {
		const pos = getIndex(Number(req.params.id));
		if (pos >= 0)
			resResult(res, data.list[pos]);
		else
			resError(res, NOT_FOUND);
	});

	router.post('/', (req, res) => {
		const elem = req.body;
		elem.id = data.id++;
		data.list.push(elem);
		resResult(res, elem);
	});

	router.put('/:id', (req, res) => {
		const pos = getIndex(Number(req.params.id));
		if (pos >= 0) {
			data.list[pos] = req.body;
			resResult(res, true);
		}
		else
			resError(res, NOT_FOUND);
	});

	router.delete('/:id', (req, res) => {
		const pos = getIndex(Number(req.params.id));
		if (pos >= 0) {
			data.list.splice(pos, 1);
			resResult(res, true);
		}
		else
			resError(res, NOT_FOUND);
	});

	function getIndex(id) {
		const n = data.list.length;
		for (let pos = 0; pos < n; ++pos)
			if (data.list[pos].id === id)
				return pos;
		return -1;
	}

	function resResult(res, result) {
		res.json({result, length: data.list.length});
	}

	function resError(res, error) {
		res.json({error, length: data.list.length});
	}

	return router;
};
