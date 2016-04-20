'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    chokidar = require('chokidar'),
    browserSync = require('browser-sync'),
    conf = require('../config')
    ;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'notify']
});

gulp.task('serve', ['build:less', 'build:twig'], function() {
 
    browserSync({
        logFileChanges: false,
        server: 'web',
        files: ['web/css/*.css', 'web/js/*.js', 'web/*.html']
    });
    gulp.start('watch:twig');
    gulp.start('watch:less');
});

gulp.task('build', ['build:less', 'build:twig']);