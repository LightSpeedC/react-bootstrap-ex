module.exports = function (context) {
	const menus = {list: [
		{id:1, name:'menu1', children:[
			{id:3, name:'menu1-1', href: '', parent_id:1},
			{id:4, name:'menu1-2', href: '', parent_id:1},
		]},
		{id:2, name:'menu2', children:[
			{id:5, name:'menu2-1', href: '', parent_id:2},
			{id:6, name:'menu2-2', href: '', parent_id:2},
		]},
	]};
	menus.id = menus.list.reduce(function x(a, b) { return Math.max(
		b.children ? b.children.reduce(x, 0) : 0, a, b.id + 1); }, 0);
	console.log(menus);
	context.menus = menus;

	const router = require('express').Router();

	router.get('/', (req, res) => res.json(menus.list));

/*
	router.get('/:id', (req, res) => res.json(menus.list[req.params.id]));

	router.post('/', (req, res) => {
		const menu = req.body;
		menu.id = menus.id++;
		menus.list.push(menu);
		res.json(menu.id);
	});

	router.put('/:id', (req, res) => {
		menus.list[req.params.id] = req.body;
		res.json(true);
	});

	router.delete('/:id', (req, res) => {
		delete menus.list[req.params.id];
		res.json(true);
	});
*/

	return router;
};
