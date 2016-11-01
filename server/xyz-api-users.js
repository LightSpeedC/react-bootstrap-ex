module.exports = function (context) {
	const users = {list: [{id:0,name:'user0'}, {id:1,name:'user1'}]};
	users.id = users.list.reduce((a, b) => Math.max(a, b.id + 1), 0);
	context.users = users;

	const router = require('express').Router();

	router.get('/', (req, res) => res.json(users.list));

	router.get('/:id', (req, res) => res.json(users.list[req.params.id]));

	router.post('/', (req, res) => {
		const user = req.body;
		user.id = users.id++;
		users.list.push(user);
		res.json(user.id);
	});

	router.put('/:id', (req, res) => {
		users.list[req.params.id] = req.body;
		res.json(true);
	});

	router.delete('/:id', (req, res) => {
		delete users.list[req.params.id];
		res.json(true);
	});

	return router;
};
