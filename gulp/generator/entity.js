'use strict';
/**
 * Compile LESS files
 */
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('path'),
    fs   = require('fs'),
    args = require('yargs').argv,
    conf = require('../config');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'del','vinyl-paths','imagemin-pngquant']
});

function generateActionCtrl(ctrl, action, isLast) {
    var data = '\t' + action +':{\n';
    data += '\t\talias:\'' + ctrl + '-' + action + '\',\n';
    data += '\t\ttemplate:\'' + ctrl + '/' + action + '.html.twig\',\n';
    data += '\t\tmodels:[]\n';
    data += '\t}';
    if(!isLast) {
        data += ',\n';
    }
    return data;
}

function generateCtrl(ctrl,actions) {
    var data = 'exports.' + ctrl + ' = {\n';
    var last = actions.length - 1;
    for(var key in actions) {
        if(actions.hasOwnProperty(key)) {
            data += generateActionCtrl(ctrl, actions[key],last == key);
        }
    }
    data += '\n};';
    return data;
}

function generateMethods(entity, methods) {
    var data = 'function ' + entity[0].toUpperCase() + entity.slice(1) + '(';
    var last = methods.length - 1;
    var key;
    for(key in methods) {
        if(methods.hasOwnProperty(key)) {
            data += methods[key];
            if(key != last) {
                data += ', ';
            }
        }
    }
    data += '){\n';
    for(key in methods) {
        if(methods.hasOwnProperty(key)) {
            data += '\tthis.' + methods[key] + ' = ' + methods[key] + ';\n' ;
        }
    }
    data += '}\n';
    data += 'module.exports.'+ entity +' = [];';
    return data;
}

function generateViews(ctrl, action) {
    return '{% extends \'base.html.twig\' %}\n\n{% block content %}\n<pre>/markup/views/' + ctrl + '/' + action +'.html.twig</pre>\n{% endblock %}'
}

gulp.task('entity', function () {
    var entities = args.e || null,
        methods  = args.m || null,
        actions  = args.a || null;

    entities = entities ? entities.replace(/\s+/g, '').split(',') : ['list', 'show'];
    methods  = methods ? methods.replace(/\s+/g, '').split(',') : ['id', 'name'];
    actions  = actions ? actions.replace(/\s+/g, '').split(',') : ['list', 'show'];

    if(entities.length > 0) {
        for(var key in entities) {
            if(entities.hasOwnProperty(key)) {
                var entity = entities[key].toLowerCase();
                var entityViews = conf.markup.views + '/' + entity;
                var entityModel = conf.markup.models + '/' + entity + '.js';
                var entityCtrl = conf.markup.ctrls + '/' + entity + '.js';

                if(!fs.existsSync(entityCtrl) && !fs.existsSync(entityModel) && !fs.existsSync(entityViews) ) {
                    fs.writeFile( entityCtrl, generateCtrl(entity,actions));
                    fs.writeFile( entityModel, generateMethods(entity, methods));
                    fs.mkdirSync(entityViews);
                    for(var actionKey in actions) {
                        if(actions.hasOwnProperty(actionKey)) {
                            var action = actions[actionKey];
                            fs.writeFile(conf.markup.views + '/' + entity + '/' + action + '.html.twig', generateViews(entity, action));
                        }
                    }
                } else {
                    console.log('Entity ' + entity + ' is exists! \n');
                }

            }
        }
    } else {
        console.log('Entities is empty\n');
    }

});