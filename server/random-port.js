var s = process.env.USERNAME;
var cs = 0;
for (var i = 0; i < s.length; ++i) {
	//console.log(s[i], i, s.codePointAt(i));
	cs += s.codePointAt(i) * (i + 1);
}
var port = cs % 1000 + 3000;
console.log('set PORT=' + port + '\r');
console.log('set HOT_RELOAD_PORT=' + (port + 1) + '\r');
