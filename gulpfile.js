var gulp = require('gulp');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var del = require('del');

var version = '0.1.5';
var prj_name = 'gen_enum';
var prj_src_name = 'gen_enum.src';

var src_path = './gen_enum.src.js';
var tgt_path = './gen_enum.js';
var test_file = 'test.js';
var test_path = './test';


gulp.task('lint-main', function() {
  return gulp.src(src_path)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('lint-test', function() {
  return gulp.src(test_path)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('minify', function () {
   gulp.src(src_path)
      .pipe(uglify())
      .pipe(rename(tgt_path))
      .pipe(gulp.dest('./'));
});

gulp.task('clean-test', function(cb) {
  del([test_path + '/**'], cb);
})

gulp.task('test-prepare', ['clean-test'], function() {
  return gulp.src(test_file)
    .pipe(replace(/TESTSRC/g, prj_src_name))
    .pipe(gulp.dest(test_path));
});

gulp.task('mocha', function() {
  return gulp.src(test_path + '/' + test_file, {read: false})
    .pipe(mocha({reporter: 'dot'}));
})

gulp.task('test', ['test-prepare', 'mocha']);

gulp.task('test-build-prepare', ['clean-test'], function() {
  return gulp.src(test_file)
    .pipe(replace(/TESTSRC/g, prj_name))
    .pipe(gulp.dest(test_path));
});

gulp.task('test-build', ['minify', 'test-build-prepare', 'mocha']);

gulp.task('build', ['test-build']);

gulp.task('default', ['lint-main', 'lint-test', 'test']); 
