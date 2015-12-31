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

// Clean
gulp.task('clean', function() {
    return gulp.src(conf.markup.root + '/*.html')
        .pipe($.vinylPaths($.del));
});

// Compile Swig
gulp.task(conf.mvc.task, [ 'clean', 'models:all'], function() {

    var getLocalPath = function(src){
        return src.replace(conf.root + path.sep + conf.markup.views.replace('\/',path.sep) + path.sep,'')
    };
    return gulp.src(conf.mvc.ctrls)
        .pipe($.plumber({
            errorHandler: function (error) {
                $.notify.onError(function (error) {
                    return '\nAn error occurred while processing compiled twig-files.\n' + error;
                });
            }
        }))
        .pipe($.foreach(function (stream, file) {
                var jsonFile = file;
                var jsonBasename = path.basename(jsonFile.path, path.extname(jsonFile.path));
                var ctrls  = require(jsonFile.path);

                var paths = [], data = [];
                for (var ctrl in ctrls) {
                    if (ctrls.hasOwnProperty(ctrl)) {
                        for (var action in ctrls[ctrl]) {

                            paths.push(conf.root + '/' + conf.markup.views + '/' + ctrls[ctrl][action].template);
                            ////data[ctrls[ctrl][action].template] = action;

                        }
                    }
                }

                return gulp.src(paths)
                    .pipe($.foreach(function (stream, file) {

                        //console.log(currentAction.path);
                        return gulp.src(file.path)
                            .pipe($.swig({
                                defaults: {
                                    loader: loader(),
                                    cache: false,
                                    locals: $.requireWithoutCache(conf.root + '/' + conf.markup.models + '/all.js', require)
                                }
                            }))
                            .pipe($.rename(function (path) {
                                path.basename = path.basename.replace(/\..+$/, '');
                            }))
                            .pipe(gulp.dest(conf.htdocs.root));
                    }));
            })
        )
        .on('error', $.notify.onError(function (error) {
            return '\nError! Look in the console for details.\n' + error;
        }))
        .pipe($.browserSync.reload({stream:true}));
});