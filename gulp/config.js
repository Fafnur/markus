'use strict';
var gutil = require('gulp-util');

exports.root = process.env.INIT_CWD;

/**
 * Root folder web-app
 */
var htdocs = {
    root:   'web',
    css:    'web/css',
    less:   'web/less',
    js:     'web/js',
    images: 'web/images'
};
exports.htdocs = htdocs;

/**
 * Root folder src
 */
var markup = {
    root:  'markup',
    models: 'markup/models',
    views:  'markup/views',
    ctrls:  'markup/controllers'
};
exports.markup = markup;

/**
 * Path watchers files
 */
var mvc = {
    models: markup.models + '/*.js',
    views: markup.views + '/**/*.twig',
    ctrls: markup.ctrls + '/*.js'
};
exports.mvc = mvc;

/**
 * Options for Swig.js compiler
 */
var swig = {
    usePostfix: true,
    useLodader: true,
    useGlobalData: false
};
exports.swig  = swig;

exports.browserAutoOpen = false;

/**
 * Preprocessor css
 */
var preCSS = {
    name: 'less',
    src: [
        htdocs.less + '/vars/variables.less',
        htdocs.less + '/vars/mixin.less',
        htdocs.less + '/common/*.less',
        htdocs.less + '/libs/**/*.less',
        htdocs.less + '/libs/**/*.css',
        htdocs.less + '/snippets/**/*.less',
        htdocs.less + '/modules/**/*.less',
        htdocs.less + '/modules/**/**/*.less',
        htdocs.less + '/components/**/*.less'
    ],
    modules:      htdocs.less + '/modules',
    in:           'template.less',
    out:          'template.css',
    outMin:       'template.min.css',
    isSourcemaps: false
};
exports.preCSS = preCSS;

/**
 * Custom system templates for web-app
 */
exports.templates = [
    htdocs.root + '/components/markup-templates/templates'
];

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
    'use strict';

    return function(err) {
        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
        this.emit('end');
    };
};