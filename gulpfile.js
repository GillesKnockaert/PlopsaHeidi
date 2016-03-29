var gulp = require('gulp');
var cache = require('gulp-cache');
var path = require('path');
var _ = require('lodash');
var painter = require('./gulp/painter');

// The gulp-plugins plugin is responsible for loading all other plugins.
// It automatically finds all plugins in node_modules prefixed with 'gulp',
// and returns an object containing all these plugins as attributes. For example,
// the plugin gulp-imagemin will be available as plugins.imagemin.
// Additional modules which aren't prefixed with 'gulp' can be loaded with the
// pattern/rename attributes in the parameter object, as below.
var plugins = require('gulp-load-plugins')({
  lazy: true,
  pattern: [
    'gulp-*',
    'gulp.*',
    'del',
    'browser-sync',
    'vinyl-source-stream',
    'vinyl-buffer',
    'merge-stream',
    'karma'
  ],
  rename: {
    'gulp-if': 'gulpif',
    'vinyl-source-stream': 'source',
    'vinyl-buffer': 'buffer',
    'browser-sync': 'browserSync',
    'merge-stream': 'mergeStream',
    karma: 'karma'
  }
});

// The config.json file is used to set all config parameters. Refer to the README.md
// for more information.
var baseConfig = require('./gulp.config.json'),
    config = baseConfig.default;

// Check if an environment variable has been set in the gulp command. If so, modify
// the config file by merging the object with the same name as the env variable
// with the default config object. For example, if you use the command gulp build --env=dev,
// this will look for a dev object in the config.json and merge it's contents with
// the default object's contents.
if (plugins.util.env.env && baseConfig[plugins.util.env.env]) {
  config = _.merge(config, baseConfig[plugins.util.env.env]);
}

plugins.getFolders = require('./gulp/getFolders').getFolders;

plugins.path = path;

function getTask(task) {
  return require('./gulp/' + task)(gulp, plugins, config);
}

// 1. Compile any .jade files in assets to html files in public (mostly just index.jade)
//    If plain html is used, just move it to the public folder.
// 2. Compile .jade template files in app/templates to html.
//    If plain html is used, just move them to the tmp folder awaiting step 3.
// 3. Convert that html to js so it can be added to templateCache
//    This places all templates in module subfolders in the
//    templates/modules directory in a templateCache of an angular
//    module with that name. Make sure the directory name of your
//    template/modules subdirectory is the same as the actual module!
gulp.task('compile-templates', getTask('compileTemplates'));
gulp.task('templateCache', ['compile-templates'],
  getTask('templateCache', 'tmp', config.defaultDest + '/templates')
);

// Compile sass to css
gulp.task('styles', function() { require('./gulp/styles').compileCss(config); });

// Optimize images
gulp.task('optimizeImages', getTask('image'));

// Concat and uglify the angular app, modules, scripts and libs
gulp.task('scripts', function() { require('./gulp/scripts').compileJs(config); });
gulp.task('angularScripts', getTask('angularScripts'));

gulp.task('libs', require('./gulp/libs').compileLibs(config));

// Gulp task for unit testing and E2E testing
gulp.task('test', getTask('test'));

// Clean the public folder of everything except images.
gulp.task('clean', function() {
  plugins.del.sync(
    ['public/scripts', 'public/styles', 'public/templates', 'public/*.html']
  );
});

var buildTasks = [
  'optimizeImages',
  'compile-templates',
  'libs'
];

if (config.angular.isAngularProject) {
  buildTasks.push('angularScripts', 'templateCache');
}

// Html injection task. All previous build tasks need to have completed before
// running this one
gulp.task('inject', buildTasks, require('./gulp/inject').injectStylesAndScripts(config));

// jscs:disable
gulp.task('build', ['inject'], function () {
  plugins.del('tmp');
  painter.paintBazookas();
});

gulp.task('serve', ['build'], getTask('serve'));
gulp.task('default', ['serve']);
