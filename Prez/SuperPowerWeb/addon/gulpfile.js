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

var port = 9000;

gulp.task('set_port_game', function(){
  port = 8000;
});

gulp.task('serv_node_app', shell.task(['sudo node app_node_prez.js']));

gulp.task('serv_node_game', shell.task(['node app_node_game.js']));

gulp.task('watch',['browserify_app', 'browserify_prez', 'browserify_game', 'sass'], function(){
  browserSync.init({
    port : 3010,
    proxy :  'http://localhost:'+port
  });
  gulp.watch("./sass/**/*.scss", ['sass']);
  gulp.watch("./scripts/app/**/*.js", ['browserify_app']);  
  gulp.watch("./scripts/prez/**/*.js", ['browserify_prez']);  
  gulp.watch("./scripts/game/**/*.js", ['browserify_game']);  
  gulp.watch("./**/*.html").on('change', reload);  
  gulp.watch("./bundle_*.js").on('change', reload);
});

gulp.task('serve', function(){  
  runSequence(
    ['watch', 'serv_node_app']
  );  
});

gulp.task('serve_game', function(){  
  runSequence(
    ['set_port_game','watch', 'serv_node_game']
  );  
});

gulp.task('sass',function(){
  return gulp.src('./sass/**/*.scss')
  .pipe(sourcemaps.init())
  .pipe(sass()).on('error', function logError(error) {
      console.error(error);
  })
  .pipe(sourcemaps.write())
  .pipe(gulp.dest('./css'))
  .pipe(reload({stream:true}));  
});

gulp.task('browserify_app',function(){
  return browserify(['./scripts/app/app.js'], {debug:true})
    .bundle()    
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })    
    .pipe(source('bundle_app.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('browserify_game',function(){
  return browserify(['./scripts/game/game.js'], {debug:true})
    .bundle()    
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })    
    .pipe(source('bundle_game.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('browserify_prez',function(){
  return browserify(['./scripts/prez/prez_super_power.js'], {debug:true})
    .bundle()    
    .on('error', function(err){
      console.log(err);
      this.emit('end');
    })    
    .pipe(source('bundle_prez.js'))
    .pipe(gulp.dest('./'));
});


/* Default task */
gulp.task("default", ["serve"]);
