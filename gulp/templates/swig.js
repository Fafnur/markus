'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs   = require('fs'),
    conf = require('../config'),
    loader = require('./loader');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*','browser-sync','plumber','notify', 'require-without-cache', 'del','vinyl-paths']
});

gulp.task('ctls:del', function () {
    return gulp.src( conf.markup.ctrls + '/all.js')
        .pipe($.vinylPaths($.del))
});

gulp.task('ctls:all', ['ctls:del'], function() {
    return gulp.src(conf.mvc.ctrls)
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(conf.markup.ctrls));
});

gulp.task('models:del', function () {
    return gulp.src( conf.markup.models + '/all.js')
        .pipe($.vinylPaths($.del))
});

gulp.task('models:all',['models:del'], function() {
    return gulp.src(conf.mvc.models)
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(conf.markup.models));
});

// Compile Swig
gulp.task(conf.mvc.task, ['ctls:all', 'models:all'], function() {

    var ctrls = require(conf.root + '/' + conf.markup.ctrls + '/all');

    var paths = [];
    for (var ctrl in ctrls) {
        for (var action in ctrls[ctrl]) {
            paths.push(conf.root + '/' + conf.markup.views + '/' + ctrls[ctrl][action].template);
            //var models =  ctrls[ctrl][action].models;
            //models.push('common');
            //data[ctrls[ctrl][action].template] = models;
        }
    }

    return gulp.src(paths)
        .pipe($.plumber({
            errorHandler: function (error) {
                $.notify.onError(function (error) {
                    return '\nAn error occurred while processing compiled twig-files.\n' + error;
                });
            }
        }))
        .pipe($.swig({
            defaults: {
                loader: loader(),
                cache: false,
               // locals: $.requireWithoutCache('e:\\domains\\markus\\markup\\models\\all.js', require)
            }
        }))
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe($.rename(function (path) {
            path.basename = path.basename.replace(/\..+$/, '');
        }))
        .pipe(gulp.dest(conf.htdocs.root))
        .pipe($.browserSync.reload({stream:true}));
});