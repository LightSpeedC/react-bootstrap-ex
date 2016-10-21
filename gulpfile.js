// gulpfile.js

'use strict';

const gulp       = require('gulp'), task = gulp.task.bind(gulp);
const plumber    = require('gulp-plumber');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');
const browserify = require('browserify');
const babelify   = require('babelify');
const source     = require('vinyl-source-stream');
const run        = require('run-sequence');

task('default', ['build'], cb => run('watch', 'web', cb));

task('build', cb => run('browserify', 'uglify', cb));

task('watch', () =>
	gulp.watch('./src/jsx/*.js', ['build']));

task('browserify', () =>
	browserify('./src/jsx/app.js', {debug: true})
	.transform(babelify, {presets: ['es2015', 'react']})
	.bundle()
	.pipe(plumber())
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('./js/')));

task('uglify', () =>
	gulp.src('./js/bundle.js')
	.pipe(uglify())
	.pipe(rename('bundle.min.js'))
	.pipe(gulp.dest('./js/min/')));
//	.pipe(uglify({preserveComments: 'license'}))

const http = require('http');
const fs   = require('fs');
const path = require('path');
task('web', cb =>
	http.createServer((req, res) =>
		fs.createReadStream(path.join(__dirname,
			req.url + (req.url.endsWith('/') ? 'index.html' : '')))
		.on('error', err => (res.end(err + ''), console.error(err)))
		.pipe(res)
		.on('error', err => (res.end(err + ''), console.error(err)))
	).listen(process.env.PORT || 3000, cb));
