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
    pattern: ['gulp-*', 'del','vinyl-paths']
});

// Symfony generate controllers
gulp.task('symfony:generate:controllers', function (cb) {
    var _tpl = 'php app/console generate:controller --no-interaction --controller=AppBundle:';

    function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return gulp.src(conf.mvc.ctrls)
        .pipe($.tap(function(file) {
            var obj = require(file.path),
                name = Object.keys(obj)[0],
                ctrl = obj[name];

            var actions = ' --actions="';
            for (var key in ctrl) {
                if(ctrl.hasOwnProperty(key)) {
                    var action = ctrl[key];
                    actions += key + 'Action:' + action.route + ':' + action.template + ' ';
                }
            }
            actions = '"';

            var command = _tpl +  capitaliseFirstLetter(name.toLowerCase()) + ' ' + actions;
            $.exec(command, function (err, stdout, stderr) {
                console.log(stdout);
                console.log(stderr);
                cb(err);
            });
        }));
});


