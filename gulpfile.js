// gulpfile.js

'use strict';

const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');
const browserify = require('browserify');
const babelify   = require('babelify');
const source     = require('vinyl-source-stream');
const run        = require('run-sequence');
const notify     = require('gulp-notify');

const SRC_FILES = ['src/**/*.html', 'src/**/*.css', 'src/**/*.ico'];

gulp.task('default', ['build', 'copy-files'], cb => run('watch', 'watch-files', cb));

gulp.task('build', cb => run('browserify' /*, 'uglify'*/, cb));

gulp.task('watch', () =>
	gulp.watch('src/xyz/jsx/*.js', ['build']));

gulp.task('browserify', () =>
	browserify('src/xyz/jsx/app.js', {debug: true})
		.on('error', () => console.log('eh!?'))
		.transform(babelify, {presets: ['es2015', 'react']})
		.bundle()
		//.pipe(plumber())
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('dist/xyz/js/'))
		.pipe(notify({message:'ブラウザリファイ終了', title:'Gulp'}))
);

gulp.task('uglify', () =>
	gulp.src('dist/xyz/js/bundle.js')
		.pipe(uglify())
		.pipe(rename('bundle.min.js'))
		.pipe(gulp.dest('dist/xyz/js/min/')));
//		.pipe(uglify({preserveComments: 'license'}))

gulp.task('watch-files', () =>
	gulp.watch(SRC_FILES, ['copy-files']));

gulp.task('copy-files', () =>
	gulp.src(SRC_FILES)
		.pipe(gulp.dest('dist/')));

const http = require('http');
const fs   = require('fs');
const path = require('path');
gulp.task('web', cb =>
	http.createServer((req, res) =>
		fs.createReadStream(path.join(__dirname, 'dist',
			req.url + (req.url.endsWith('/') ? 'index.html' : '')))
		.on('error', err => (res.end(err + ''), console.error(err)))
		.pipe(res)
		.on('error', err => (res.end(err + ''), console.error(err)))
	).listen(process.env.PORT || 3000, cb));
