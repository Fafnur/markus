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
    ctrlsMap = [],
    ctrlsCount = 0
    ;

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*','browser-sync', 'plumber','notify', 'require-without-cache', 'run-sequence']
});

gulp.task('clean:html', function() {
    return gulp.src(conf.htdocs.root + '/*.html')
        .pipe($.rimraf());
});

gulp.task('clean:models', function () {
    return gulp.src( conf.markup.models + '/all.js')
        .pipe($.rimraf())
});

gulp.task('build:models', ['clean:models'], function() {
    return gulp.src(conf.mvc.models)
        .pipe($.concat('all.js'))
        .pipe(gulp.dest(conf.markup.models));
});

gulp.task('generate:ctrl-map', function() {
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

            function isActive(action) {
                var ret = true;
                if(action == false) {
                    ret = false;
                }
                return ret;
            }
            for (var item in ctrl) {
                if(ctrl.hasOwnProperty(item)) {
                    var action = ctrl[item];
                    ctrlsMap[ctrlsCount] = {
                        id: ctrlsCount,
                        ctrl: name,
                        name: action.name,
                        tpl: conf.markup.views + '/' + action.template,
                        action: item,
                        alias: action.alias,
                        models: getModels(action.models),
                        active: isActive(action.isActive)
                    };
                    ctrlsCount++;
                }
            }
        }));
});
 
gulp.task('twig', function() {

    function merge_options(objs){
        var ret = {};
        for (var key in objs) {
            var obj = objs[key];
            for (var attr in obj) {
                ret[attr] = obj[attr];
            }
        }
        return ret;
    }

    for(var key in ctrlsMap) {
        if(ctrlsMap.hasOwnProperty(key)) {
            var ctrl = ctrlsMap[key];
            if(!ctrl.active) {
                continue;
            }
            // TODO: тут должна быть синхронная загрузка и компиляция шаблона
            //if(!conf.swig.useGlobalData) {
            //    //data = ctrl.ctrl + '_' + ctrl.action + '_all.js';
            //    console.log(ctrl.models);
            //    gulp.src(ctrl.models)
            //        .pipe($.concat('all.js'))
            //        .pipe(gulp.dest(conf.markup.models));
            //}

            gulp.src(ctrl.tpl)
                .pipe($.swig({
                    defaults: {
                        loader: loader(),
                        cache: false,
                        locals: merge_options([
                            $.requireWithoutCache(conf.root + path.sep + conf.markup.models.replace('\/',path.sep) + path.sep + 'all.js', require),
                            {'ctrlsMap':ctrlsMap},
                            {'path':function(param, arg){
                                for(var key in ctrlsMap) {
                                    if(ctrlsMap.hasOwnProperty(key)){
                                        var ctrl = ctrlsMap[key];
                                        var route = ctrl.ctrl + '_' + ctrl.action;
                                        if(route == param || ctrl.name == param) {
                                            return ctrl.alias + '.html';
                                        }
                                    }
                                }
                                return 'index.html';
                            }}
                        ])
                    }
                }))
                .pipe($.plumber({
                    errorHandler: function (error) {
                        console.log('\nError in twig file:' + ctrl.tpl + '\n'  + error);
                    }
                }))
                .pipe($.rename(ctrl.alias + '.html'))
                .pipe(gulp.dest(conf.htdocs.root))
            ;
        }
    }
    $.browserSync.reload({stream:true});
});

gulp.task('rebuild:ctrl', function(cb) {
    $.runSequence(
        'clean:html',
        'generate:ctrl-map',
        'twig',
        cb
    );
});
gulp.task('rebuild:models', function(cb) {
    $.runSequence(
        'build:models',
        'twig',
        cb
    );
});
gulp.task('build:twig', function(cb) {
    $.runSequence(
        ['build:models', 'generate:ctrl-map'],
        'twig',
        cb
    );
});

gulp.task('watch:twig', ['build:twig'], function() {
    
    chokidar.watch(conf.mvc.views, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('change', function (event, path) {
        gulp.start('twig');
    });

    chokidar.watch(conf.mvc.ctrls, {
        ignored: '',
        persistent: true,
        ignoreInitial: true
    }).on('change', function (event, path) {
        gulp.start('rebuild:ctrl');
    });

    chokidar.watch([
        conf.mvc.models, 
        '!' + conf.markup.models + '/all.js' 
    ], {
        ignored: 'all.js',
        persistent: true,
        ignoreInitial: true
    }).on('change', function (event, path) {
        gulp.start('rebuild:models');
    });
});