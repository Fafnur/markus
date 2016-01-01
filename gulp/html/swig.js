'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs   = require('fs'),
    chokidar   = require('chokidar'),
    conf = require('../config'),
    loader = require('./loader'),
    ctlsMap = [],
    ctlsCount = 0
    ;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*','browser-sync','plumber','notify', 'require-without-cache', 'del','vinyl-paths']
});

gulp.task('compile:clean:html', function() {
    return gulp.src(conf.markup.root + '/*.html')
        .pipe($.vinylPaths($.del));
});

gulp.task('compile:models:del', function () {
    return gulp.src( conf.markup.models + '/all.js')
        .pipe($.vinylPaths($.del))
});

gulp.task('compile:models:all',['compile:models:del'], function() {
    return gulp.src(conf.mvc.models)
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(conf.markup.models));
});

gulp.task('compile:generate-ctrl-map', function() {
    var getModels = function(models) {
        var listModels = [];
        var modelsPath = conf.markup.models + '/';
        listModels[0] = modelsPath + 'common.js';
        var count = 1;
        for(var key in models) {
            if(models.hasOwnProperty(key)) {
                listModels[count] = modelsPath + models[key] + '.js';
                count++;
            }
        }
        return listModels;
    };

    return gulp.src(conf.mvc.ctrls)
        .pipe($.tap(function(file) {
            var obj = require(file.path),
                name = Object.keys(obj)[0],
                ctrl = obj[name];

            for (var item in ctrl) {
                if(ctrl.hasOwnProperty(item)) {
                    var action = ctrl[item];
                    ctlsMap[ctlsCount] = {
                        id: ctlsCount,
                        ctrl: name,
                        tpl: conf.markup.views + '/' + action.template,
                        action: action,
                        alias: action.alias,
                        models: getModels(action.models)
                    };
                    ctlsCount++;
                }
            }
        }));
});

// Compile Swig
gulp.task('compile:twig', function() {
    for(var key in ctlsMap) {
        if(ctlsMap.hasOwnProperty(key)) {
            var ctrl = ctlsMap[key];
            var data = 'all.js';

            // TODO: тут должна быть синхронная загрузка и компиляция шаблона
            //if(!conf.swig.useGlobalData) {
            //    //data = ctrl.ctrl + '_' + ctrl.action + '_all.js';
            //    console.log(ctrl.models);
            //    gulp.src(ctrl.models)
            //        .pipe($.concat(data))
            //        .pipe(gulp.dest(conf.markup.models));
            //}

            gulp.src(ctrl.tpl)
                .pipe($.plumber({
                    errorHandler: function (error) {
                        console.log('\nError in twig file:' + ctrl.tpl + '\n'  + error);
                    }
                }))
                .pipe($.swig({
                    defaults: {
                        loader: loader(),
                        cache: false,
                        locals: $.requireWithoutCache(conf.root + path.sep + conf.markup.models.replace('\/',path.sep) + path.sep + data, require)
                    }
                }))
                .pipe($.rename(ctrl.alias + '.html'))
                .pipe(gulp.dest(conf.htdocs.root))
            ;
        }
    }
    // TODO: Добавить browserSync.reload - gulp.src(..).pipe($.browserSync.reload({stream:true}));
});

gulp.task('compile:build:twig', ['compile:clean:html', 'compile:models:all','compile:generate-ctrl-map'], function() {
    gulp.start('compile:twig');
});

gulp.task('compile:rebuild:ctrls', ['compile:generate-ctrl-map'], function() {
    gulp.start('compile:twig');
});

gulp.task('compile:rebuild:models', ['compile:models:all'], function() {
    gulp.start('compile:twig');
});

gulp.task('compile:watch:twig', ['compile:clean:html'], function() {
    gulp.start('compile:build:twig');

    chokidar.watch(conf.mvc.views, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('compile:twig');
    });

    chokidar.watch(conf.mvc.ctrls, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('compile:rebuild:ctrls');
    });

    chokidar.watch(conf.mvc.models, {
        ignored: 'all.js',
        persistent: true,
        ignoreInitial: true
    }).on('all', function (event, path) {
        gulp.start('compile:rebuild:models');
    });
});