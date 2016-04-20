'use strict';
/**
 * Compress images
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*','imagemin-pngquant']
});

gulp.task('clean:images', function() {
    return gulp.src(conf.htdocs.root + '/compress-images')
        .pipe($.rimraf());
});

gulp.task('compress:images', ['clean:images'], function () {
    console.log(conf.htdocs.images);
    return gulp.src(conf.htdocs.images + '/**/*')
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [$.imageminPngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(conf.htdocs.root + '/compress-images'));
});