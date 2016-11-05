// gulpfile.js

'use strict';

console.log('gulp starting...');

const gulp       = require('gulp');
const plumber    = require('gulp-plumber');
const uglify     = require('gulp-uglify');
const rename     = require('gulp-rename');
const browserify = require('browserify');
const babelify   = require('babelify');
const literalify = require('literalify');
const source     = require('vinyl-source-stream');
const notify     = require('gulp-notify');
const notifier   = require('node-notifier');
const run        = require('run-sequence');
const del        = require('del');

const X = ['xyz', 'ex03-react-gulp', 'zzz'];
const SRC_FILES = [
		'src/**/*.html',
		'src/**/*.css',
		'src/**/*.ico',
		'src/**/*.json',
		'src/**/*.js'];
const FONTS_FILES = ['node_modules/bootstrap/dist/fonts/**/*.*'];
const CSS_FILES = ['node_modules/bootstrap/dist/css/**/*.*'];
const LIB_FILES = ['src/lib/**/*.js'];
const MIN_FILES = [
		'node_modules/react/dist/*.min.js*',
		'node_modules/react-dom/dist/*.min.js*',
		'node_modules/react-router/umd/*.min.js*',
		'node_modules/react-bootstrap/dist/*.min.js*',
		'node_modules/regenerator-runtime/runtime.js',
		'node_modules/light-request/light-request.js',
		'node_modules/promise-thunk/promise-thunk.js',
		'node_modules/promise-light/promise-light.js',
		'node_modules/aa/aa.js'];

X.forEach(x => {

	gulp.task('browserify-' + x, () =>
		browserify({debug: true})
			.on('error', err => console.log('eh!?', err))
			.transform(babelify, {presets: ['es2015', 'react']})
			.transform(literalify, {
				'react': 'window.React',
				'react-dom': 'window.ReactDOM',
				'react-router': 'window.ReactRouter',
				'react-bootstrap': 'window.ReactBootstrap',
				'request': 'light-request',
				'PromiseThunk': 'promise-thunk',
				'aa': 'aa'
			})
			.require('src/' + x + '/pub/jsx/app.js', {entry: true})
			.bundle()
			.on('error', err => console.log('eh!?', err))
			.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
			.pipe(source('bundle.js'))
			.pipe(gulp.dest('dist/' + x + '/pub/js/')));

	gulp.task('uglify-' + x, ['browserify-' + x], () =>
		gulp.src('dist/' + x + '/pub/js/bundle.js')
			.pipe(uglify({preserveComments: 'license'}))
			.pipe(rename('bundle.min.js'))
			.pipe(gulp.dest('dist/' + x + '/pub/js/')));

	gulp.task('build-jsx-' + x, ['uglify-' + x], () =>
		notifier.notify({message:'Build-' + x + '終了', title:'Gulp'}));

});

gulp.task('build-jsx', X.map(x => 'build-jsx-' + x));

SRC_FILES.forEach(file =>
	gulp.task('copy-' + file, () =>
		gulp.src(file)
			.pipe(gulp.dest('dist/'))));

FONTS_FILES.forEach(file =>
	gulp.task('copy-' + file, () =>
		gulp.src(file)
			.pipe(gulp.dest('dist/fonts/'))));

CSS_FILES.forEach(file =>
	gulp.task('copy-' + file, () =>
		gulp.src(file)
			.pipe(gulp.dest('dist/css/'))));

gulp.task('copy-files', SRC_FILES.concat(FONTS_FILES).concat(CSS_FILES).map(x => 'copy-' + x));

gulp.task('copy-min-js', () =>
	gulp.src(MIN_FILES)
		.pipe(gulp.dest('dist/js')));

gulp.task('build-all', ['build-jsx', 'copy-files', 'copy-min-js']);

gulp.task('watch', () => (
	X.forEach(x =>
		gulp.watch(LIB_FILES.concat('src/' + x + '/pub/jsx/*.js'), ['build-jsx-' + x])),
	SRC_FILES.forEach(file =>
		gulp.watch(file, ['copy-' + file]))
));

gulp.task('clean', cb =>
	del(['dist'], cb));

gulp.task('default', cb =>
	run('build-all', 'watch', cb));
