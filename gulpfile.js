// gulpfile.js

'use strict';

const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');
const browserify = require('browserify');
const babelify   = require('babelify');
const literalify = require('literalify');
const source     = require('vinyl-source-stream');
const run        = require('run-sequence');
const notify     = require('gulp-notify');

const SRC_FILES = ['src/**/*.html', 'src/**/*.css', 'src/**/*.ico'];

gulp.task('default', ['build', 'copy-files', 'copy-min-js'],
	cb => run('watch', 'watch-files', cb));

gulp.task('build',
	cb => run('browserify' /*, 'uglify'*/, cb));

gulp.task('watch', () =>
	gulp.watch('src/xyz/jsx/*.js', ['build']));

gulp.task('browserify', () =>
	browserify({debug: true})
		.on('error', err => console.log('eh!?', err))
		.transform(babelify.configure({presets: ['es2015', 'react']}))
		.transform(literalify.configure({
			'react': 'window.React',
			'react-dom': 'window.ReactDOM',
			'react-router': 'window.ReactRouter',
			'react-bootstrap': 'window.ReactBootstrap'
		}))
		.require('src/xyz/jsx/app.js', {entry: true})
		.bundle()
		.on('error', err => console.log('eh!?', err))
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

gulp.task('copy-min-js', () =>
	gulp.src(['node_modules/react/dist/*.min.js*',
			'node_modules/react-dom/dist/*.min.js*',
			'node_modules/react-router/umd/*.min.js*',
			'node_modules/react-bootstrap/dist/*.min.js*'])
		.pipe(gulp.dest('dist/js')));

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
