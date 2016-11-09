module.exports = function (context) {
	const books = {list: [{id:0,name:'book0'}, {id:1,name:'book1'}]};
	books.id = books.list.reduce((a, b) => Math.max(a, b.id + 1), 0);
	context.books = books;

	for (let id = books.id; id < 1e3; ++id)
		books.list.push({id, name: 'book'+id});
	books.id = books.list.reduce((a, b) => Math.max(a, b.id + 1), 0);
	const SIZE = 10;

	const router = require('express').Router();

	router.get('/', (req, res) => {
		//console.log(req.query);
		const offset = Number(req.query.offset || 0);
		const size = Number(req.query.size || SIZE);
		res.json({result: books.list.slice(offset, offset + size),
			length: books.list.length, offset, size});
	});

	router.get('/:id', (req, res) => res.json({result: books.list[req.params.id]}));

	router.post('/', (req, res) => {
		const book = req.body;
		book.id = books.id++;
		books.list.push(book);
		res.json({result: book, length: books.list.length});
	});

	router.put('/:id', (req, res) => {
		books.list[req.params.id] = req.body;
		res.json({result: true, length: books.list.length});
	});

	router.delete('/:id', (req, res) => {
		//console.log('books delete', req.params.id);
		const id = Number(req.params.id);
		books.list = books.list.filter(x => id !== x.id);
		//delete books.list[req.params.id];
		res.json({result: true, length: books.list.length});
	});

	return router;
};
