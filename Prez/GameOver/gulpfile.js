"use strict";
// Include gulp
var fs = require("fs");
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps")
var path = require("path");
var browserSync = require("browser-sync").create();
var sass = require('gulp-sass');

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var reload = browserSync.reload;


gulp.task('watch',['browserify_prez', 'sass_prez'], function(){
  browserSync.init({
    server: './'
  });
  gulp.watch("./scss/**/*.scss", ['sass_prez']);
  gulp.watch("./assets/**/*.md").on('change', reload);
  gulp.watch("./addon/**/*.js", ['browserify_prez']);  
  gulp.watch("./**/*.html").on('change', reload);  
  gulp.watch("./addon/bundle_*.js").on('change', reload);
});

gulp.task('sass_prez',function(){
  return gulp.src('./scss/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass()).on('error', function logError(error) {
      console.error(error);
  })
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./css'))
  .pipe(reload({stream:true}));  
});

gulp.task('browserify_prez',function(){
  return browserify(['./addon/prez_super_power.js'], {debug:true})
    .bundle()    
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })    
    .pipe(source('bundle_prez.js'))
    .pipe(gulp.dest('./addon'));
});


/* Default task */
gulp.task("default", ["watch"]);
