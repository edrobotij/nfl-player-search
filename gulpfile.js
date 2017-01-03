const gulp = require('gulp'),
      browserify = require('browserify'),
      transform = require('vinyl-transform'),
      util = require('gulp-util'),
      sass = require('gulp-sass'),
      babel = require('gulp-babel'),
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
  let browserified = transform((filename) => {
    let b = browserify({entries: filename, debug: true});
    return b.bundle();
  });

  return gulp.src('./app/index.js')
    .pipe(browserified)
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
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
