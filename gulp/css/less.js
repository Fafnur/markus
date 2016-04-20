'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    chokidar   = require('chokidar'),
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'sourcemaps', 'browser-sync', 'notify', 'run-sequence']
});

gulp.task('clean:less', function() {
    return gulp.src(conf.htdocs.css + '/' + conf.preCSS.out)
        .pipe($.rimraf());
});

gulp.task('less', function () {
    return gulp.src(conf.preCSS.src)
        .pipe($.concat(conf.preCSS.in))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less())
        .pipe($.rename(conf.preCSS.out))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.htdocs.css))
        .pipe($.browserSync.reload({stream: true}))
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }));
});

gulp.task('build:bootstrap', function () {
    return gulp.src(conf.htdocs.less + '/bootstrap/bootstrap.less' )
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.init()))
        .pipe($.less())
        .pipe($.cssnano())
        .pipe($.rename('bootstrap.min.css'))
        .pipe($.if(conf.preCSS.isSourcemaps, $.sourcemaps.write()))
        .pipe(gulp.dest(conf.htdocs.css))
        .on('error', $.notify.onError(function (error) {
            return '\nError compile: ' + conf.htdocs.root + '/less/bootstrap/bootstrap.less' + '\n' + error;
        }));
});

gulp.task('build:less', function(cb) {
    $.runSequence(
        'clean:less',
        'less',
        cb
    );
});

gulp.task('watch:less', ['less'], function() {
    chokidar.watch(conf.preCSS.src, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('change', function (event, path) {
        gulp.start('less');
    });
});