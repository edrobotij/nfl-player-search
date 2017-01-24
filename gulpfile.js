const gulp = require('gulp'),
      browserify = require('browserify'),
      babelify = require('babelify'),
      transform = require('vinyl-transform'),
      source = require('vinyl-source-stream'),
      buffer = require('vinyl-buffer'),
      util = require('gulp-util'),
      sass = require('gulp-sass'),
      uglify = require('gulp-uglify'),
      uglifyCss = require('gulp-uglifycss'),
      cacheBust = require('gulp-cache-bust'),
      reload = require('gulp-livereload'),
      del = require('del'),
      rename = require('gulp-rename'),
      pump = require('pump'),
      seq = require('run-sequence');

// Delete everything in ./dist
gulp.task('clean', () => {
  del([
    './dist/*.*'
  ]);
});

// Build js into ./dist
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
    .pipe(buffer())
    .pipe(gulp.dest('dist'))
    .pipe(reload());
});

// Process sass and uglify css into ./dist
gulp.task('css', () => {
  pump([
    gulp.src('./app/app.scss'),
    sass().on('error', sass.logError),
    uglifyCss({
      "maxLineLen": 100,
      "uglyComments": true
    }),
    gulp.dest('./dist'),
    reload()
  ]);
});

// Copy index.html to ./dist
gulp.task('html', () => {
  pump([
    gulp.src('./app/index.html'),
    rename({dirname: ''}),
    gulp.dest('./dist')
  ]);
});

// Cache bust assets with timestamp
gulp.task('cacheBust', () => {
  pump([
    gulp.src('./dist/*.html'),
    cacheBust({
      type: 'timestamp'
    }),
    gulp.dest('./dist'),
    reload()
  ]);
});

// Watch for any file changes and run the associated task
gulp.task('watch', () => {
  reload.listen({
    host: 'ffrosters.dev',
    port: '9401'
  });
  gulp.watch('app/*.js', ['js']);
  gulp.watch('app/*.scss', ['css']);
  gulp.watch('app/*.html', () => {
    seq('html', 'cacheBust');
  });
});

// Default build
gulp.task('default', (cb) => {
  seq('clean', 'html', 'js', 'css', 'cacheBust', cb);
});
