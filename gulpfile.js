const gulp = require('gulp'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      transform = require('vinyl-transform'),
      source = require('vinyl-source-stream'),
      util = require('gulp-util'),
      sass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      uglifyCss = require('gulp-uglifycss'),
      cacheBust = require('gulp-cache-bust'),
      del = require('del'),
      rename = require('gulp-rename'),
      pump = require('pump'),
      seq = require('run-sequence');

gulp.task('clean', () => {
  del([
    './dist/*.*'
  ]);
});

gulp.task('js', () => {
  return browserify({
      entries: './app/index.js',
      debug: true
    })
    .transform(babelify.configure({
      presets: ['es2015'],
      ignore: /(node_modules)/
    }))
    .bundle()
    .on('error', function(error) {
      console.log("Error: " + error.message);
    })
    .pipe(source('app.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', () => {
  pump([
    gulp.src('./app/app.scss'),
    sass().on('error', sass.logError),
    uglifyCss({
      "maxLineLen": 100,
      "uglyComments": true
    }),
    gulp.dest('./dist')
  ]);
});

gulp.task('html', () => {
  pump([
    gulp.src('./app/index.html'),
    rename({dirname: ''}),
    gulp.dest('./dist')
  ]);
});

gulp.task('cacheBust', () => {
  pump([
    gulp.src('./dist/*.html'),
    cacheBust({
      type: 'timestamp'
    }),
    gulp.dest('./dist')
  ]);
});

gulp.task('default', (cb) => {
  seq('clean', 'html', 'js', 'css', 'cacheBust', cb);
});
