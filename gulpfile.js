'use strict';
var gulp = require('gulp');

var uglify      = require('gulp-uglify');
var debug       = require('gulp-debug');
var sourcemaps  = require('gulp-sourcemaps');
var gutil       = require('gulp-util');
var concat      = require('gulp-concat');
var lint        = require('gulp-jshint');
var stylish     = require('jshint-stylish');
var karma       = require('gulp-karma');
var jscs        = require('gulp-jscs');
var serve       = require('gulp-serve');
var protractor  = require('gulp-protractor').protractor;
var exit        = require('gulp-exit');
var Dgeni       = require('dgeni');

var library = {
  src: './src/**/*.js',
  tests: './test/**/*.spec.js',
  temp: './tmp/',
  destination: './release/',
  maps: './maps',
  large_file: 'oblique-features.js',
  minimized: 'oblique-features.min.js'
};

gulp.task('lint', function() {
  return gulp.src([library.src])
  .pipe(debug({title: 'Linting'}))
  .pipe(lint())
  .pipe(lint.reporter(stylish))
  .pipe(jscs());
});

gulp.task('largefile', ['lint', 'test'], function() {
  return gulp.src(library.src)
  .pipe(debug({title: 'Compiling'}))
  .pipe(sourcemaps.init())
  .pipe(concat(library.large_file))
  .pipe(sourcemaps.write(library.maps))
  .pipe(gulp.dest(library.destination));
});

gulp.task('minimized', ['lint'], function() {
  return gulp.src(library.src)
  .pipe(debug({title: 'Minimizing'}))
  .pipe(sourcemaps.init())
  .pipe(concat(library.minimized))
  .pipe(uglify())
  .pipe(sourcemaps.write(library.maps))
  .pipe(gulp.dest(library.destination));
});

gulp.task('test', function() {
  return gulp.src([])
  .pipe(karma({configFile: './test/unit/karma.conf.js', action: 'run'}));
});

gulp.task('monitorUnit', ['test'], function() {
  return gulp.watch([
    'src/**/*.js',
    'test/unit/**/*.spec.js'
    ], ['test']);
});

gulp.task('default', ['largefile', 'minimized'], function() {
  gulp.start(['e2e']);
});

gulp.task('serve', serve({
  root: ['test/integration/public', 'release'],
  port: 9000,
}));

gulp.task('e2e', ['serve'], function() {
  gulp.src(['test/integration/**/*.spec.js'])
  .pipe(protractor({
    configFile: 'test/integration/protractor.conf.js',
    args: ['--baseUrl', 'http://127.0.0.1:9000']
  }))
  .on('error', function(e) { throw e; })
  .pipe(exit());
});

gulp.task('docs', function() {
  var dgeni = new Dgeni([require('./config/docs/config.js')]);
  return dgeni.generate();
});
