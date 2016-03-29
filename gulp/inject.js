var gulp          = require('gulp'),
    debug         = require('gulp-debug'),
    inject        = require('gulp-inject'),
    gulpif        = require('gulp-if'),
    util          = require('gulp-util'),
    streamSeries  = require('stream-series');

module.exports = {
  injectStylesAndScripts: function(config) {
    return function() {
      // Concatenate and minify css
      var stylesStream = require('./styles').compileCss(config);

      // Concatenate, minify and lint scripts
      var scriptStream = require('./scripts').compileJs(config);

      // No need to slow the gulp task down by loading in the libs task. We know the eventual
      // libs names from the config file, just inject them like this.
      var libFiles = [];
      for (var i = 0; i < config.libraries.length; i++) {
        libFiles.push(config.defaultDest + '/scripts/' + config.libraries[i].name + '.js');
      }

      // Concatenate, minify and fix dependency injection (etc...) for angular
      // angular scripts, if applicable.
      var angularFiles = [];
      if (config.angular.isAngularProject) {
        angularFiles.push(config.defaultDest + '/scripts/' + config.angular.appName + '.js');
        if (!config.angular.singleModule) {
          var folders = require('./getFolders').getFolders(config.angular.angularSrc + '/modules');
          for (var j = 0; j < folders.length; j++) {
            angularFiles.push(config.defaultDest + '/scripts/' + folders[j] + '.js');
          }
        }
      }

      util.log(util.colors.blue('angularFiles: ', angularFiles));

      return gulp.src(config.assetsSrc + '/index.html')
        .pipe(inject(gulp.src(libFiles, { read: false }), { name: 'libs' }))
        .pipe(inject(gulp.src(angularFiles, { read: false }), { name: 'angular' }))
        .pipe(inject(streamSeries(stylesStream, scriptStream), {ignorePath: config.defaultDest}))
        .pipe(gulp.dest(config.defaultDest));
    };
  }
};
