/*
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
*/
(this || {}).aa = function () {
	'use strict';

	if (typeof module === 'object' && module && module.exports)
		module.exports = aa;

	function aa(gen) {
		return function (cb) { void function next(err, val) {
			try { var obj = err ? gen.throw(err) : gen.next(val);
				val = obj.value;
				obj.done ? cb && cb(null, val) :
				(typeof val === 'function' ?
				val : array2thunk(val))(next);
			} catch (e) { if (cb) cb(e); else throw e; }
		} (); };
	}

	aa.callback = function callback(gfn) {
		return function () {
			return aa(gfn.apply(this, arguments))();
		};
	};

	function array2thunk(arr) {
		return function (cb) {
			var n = arr.length, res = new Array(n);
			arr.forEach(function (f, i) {
				f(function (e, v) {
					e ? n > 0 && (cb(e), n = 0) :
					res[i] = v, --n || cb(null, res);
				});
			});
		};
	}

	return aa;
} ();
