module.exports = function (context) {
	const books = {list: [{id:0,name:'book0'}, {id:1,name:'book1'}]};
	books.id = books.list.reduce((a, b) => Math.max(a, b.id + 1), 0);
	context.books = books;

	const router = require('express').Router();

	router.get('/', (req, res) => res.json(books.list));

	router.get('/:id', (req, res) => res.json(books.list[req.params.id]));

	router.post('/', (req, res) => {
		const book = req.body;
		book.id = books.id++;
		books.list.push(book);
		res.json(books.list);
	});

	router.put('/:id', (req, res) => {
		books.list[req.params.id] = req.body;
		res.json(true);
	});

	router.delete('/:id', (req, res) => {
		delete books.list[req.params.id];
		res.json(true);
	});

	return router;
};
