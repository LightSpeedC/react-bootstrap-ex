function aa(gen) {
	return function (cb) { void function next(err, val) {
		try { var obj = err ? gen.throw(err) : gen.next(val);
			obj.done ? cb(null, obj.value) : (obj.value)(next);
		} catch (e) { cb(e); }
	} (); };
}

aa.callback = function callback(gfn) {
	return function () {
		return aa(gfn.apply(this, arguments));
	};
};
