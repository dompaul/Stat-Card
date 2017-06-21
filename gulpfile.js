// Gulpfile
var gulp = require('gulp');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var sprite = require('gulp-sprite-generator');
var spritesmith = require('gulp.spritesmith');

gulp.task('copy', function() {
  gulp.src('index.html').pipe(gulp.dest('dist'));
  gulp.src('img/*.png').pipe(gulp.dest('dist/img'));
  gulp.src('player-stats.json').pipe(gulp.dest('dist'));
});

gulp.task('log', function() {
  gutil.log('== My Log Task ==')
});

gulp.task('sass', function() {
  gulp.src('styles/main.scss')
  .pipe(sass({style: 'expanded'}))
    .on('error', gutil.log)
  .pipe(gulp.dest('dist/css'))
});

gulp.task('js', function() {
  gulp.src('scripts/*.js')
  // .pipe(uglify())
  .pipe(concat('script.js'))
  .pipe(gulp.dest('dist/js'))
});

gulp.task('connect', function() {
  connect.server({
    root: './dist',
    livereload: true
  })
});

gulp.task('sprite', function () {
    var spriteData = gulp.src('img/sprites/*.png')
        .pipe(spritesmith({
            /* this whole image path is used in css background declarations */
            imgName: 'img/sprite.png',
            cssName: 'css/sprite.css'
        }));
    spriteData.img.pipe(gulp.dest('dist'));
    spriteData.css.pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('scripts/*.js', ['js']);
  gulp.watch('styles/main.scss', ['sass']);
});

gulp.task('default', ['copy','sass', 'js', 'sprite', 'watch']);
