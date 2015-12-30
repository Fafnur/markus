'use strict';

var gutil = require('gulp-util');

exports.root = process.env.INIT_CWD;

/**
 * Root folder web-app
 */
var htdocs = {
    root:   'web',
    css:    'web/css',
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
    ctrls: markup.ctrls + '/*.js',
    task: 'compile:twig'
};
exports.mvc = mvc;

/**
 * Options for Swig.js compiler
 */
var swig = {
    usePostfix: true,
    useLodader: true,
    useGlobalData: true
};
exports.swig  = swig;

/**
 * Preprocessor css
 */
var preCSS = {
    name: 'less',
    src: [
        htdocs.root + '/less/vars/variables.less',
        htdocs.root + '/less/vars/mixin.less',
        htdocs.root + '/less/common/*.less',
        htdocs.root + '/less/libs/**/*.less',
        htdocs.root + '/less/libs/**/*.css',
        htdocs.root + '/less/snippets/**/*.less',
        htdocs.root + '/less/modules/**/*.less',
        htdocs.root + '/less/modules/**/**/*.less',
        htdocs.root + '/less/components/**/*.less'
    ],
    modules:      '/less/components/**/*.less',
    in:           'template.less',
    out:          'template.css',
    isSourcemaps: false,
    task:         'compile:less'
};
exports.preCSS = preCSS;

/**
 * Custom system templates for web-app
 */
exports.markupTemplates = [
    htdocs + '/components/markup-templates/templates',
    'E:\\domains\\layouts\\templates'
];

/**
 * List watchers for web-app
 */
exports.watchers = {
    preprocessor: {
        path: preCSS.src,
        task: preCSS.task
    },
    models: {
        path: mvc.model,
        task: mvc.task
    },
    controllers: {
        path: mvc.ctrls,
        task: mvc.task
    },
    views: {
        path: mvc.views,
        task: mvc.task
    }
};

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