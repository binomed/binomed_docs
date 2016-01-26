"use strict";
// Include gulp
var fs = require("fs");
var gulp = require("gulp");
var sourcemaps = require("gulp-sourcemaps")
var path = require("path");
var browserSync = require("browser-sync").create();
var sass = require('gulp-sass');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');

var browserify = require("browserify");
var source = require('vinyl-source-stream');
var reload = browserSync.reload;

var port = 8000;

gulp.task('serv_node_app', shell.task(['sudo node addon/app_prez_server.js']));

gulp.task('watch',['browserify_app', 'browserify_prez', 'browserify_game', 'sass_prez', 'sass_addon'], function(){
  browserSync.init({
    port : 3010,
    proxy :  'http://localhost:'+port
  });
  gulp.watch("./scss/**/*.scss", ['sass_prez']);
  gulp.watch("./assets/**/*.md").on('change', reload);
  gulp.watch("./addon/sass/**/*.scss", ['sass_addon']);
  gulp.watch("./addon/scripts/app/**/*.js", ['browserify_app']);  
  gulp.watch("./addon/scripts/prez/**/*.js", ['browserify_prez']);  
  gulp.watch("./addon/scripts/game/**/*.js", ['browserify_game']);  
  gulp.watch("./**/*.html").on('change', reload);  
  gulp.watch("./addon/bundle_*.js").on('change', reload);
});

gulp.task('serve', function(){  
  runSequence(
    ['watch', 'serv_node_app']
  );  
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


gulp.task('sass_addon',function(){
  return gulp.src('./addon/sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass()).on('error', function logError(error) {
      console.error(error);
  })
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./addon/css'))
  .pipe(reload({stream:true}));  
});

gulp.task('browserify_app',function(){
  return browserify(['./addon/scripts/app/app.js'], {debug:true})
    .bundle()    
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })    
    .pipe(source('bundle_app.js'))
    .pipe(gulp.dest('./addon'));
});

gulp.task('browserify_game',function(){
  return browserify(['./addon/scripts/game/game.js'], {debug:true})
    .bundle()    
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })    
    .pipe(source('bundle_game.js'))
    .pipe(gulp.dest('./addon'));
});

gulp.task('browserify_prez',function(){
  return browserify(['./addonscripts/prez/prez_super_power.js'], {debug:true})
    .bundle()    
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })    
    .pipe(source('bundle_prez.js'))
    .pipe(gulp.dest('./addon'));
});


/* Default task */
gulp.task("default", ["serve"]);
