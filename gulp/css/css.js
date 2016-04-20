'use strict';
/**
 * Compress CSS file
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*']
});

gulp.task('clean:css', function() {
    return gulp.src(conf.htdocs.css + '/' + conf.preCSS.outMin)
        .pipe($.rimfaf());
});
 
gulp.task('build:css', ['clean:css'], function () {
    return gulp.src(conf.htdocs.css + '/' + conf.preCSS.out)
        .pipe($.autoprefixer())
        .pipe($.cssnano())
        .pipe($.rename(conf.preCSS.outMin))
        .pipe(gulp.dest(conf.htdocs.css));
});