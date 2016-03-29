var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    gulpif      = require('gulp-if'),
    uglify      = require('gulp-uglify'),
    mergeStream = require('merge-stream'),
    gulpPrint   = require('gulp-print'),
    changed     = require('gulp-changed');

module.exports = {
  compileLibs: function(config) {
    return function() {
      var mergedStream;

      // JS compile function
      function compileJsLibs(src, filename, dest, minify) {
        return gulp.src(src)
          .pipe(gulpif(config.verbose, gulpPrint(function(filepath) {
            return 'running libs-task on: ' + filepath;
          })))
          .pipe(concat(filename))
          .pipe(gulpif(minify, uglify()))
          .pipe(gulp.dest(dest + '/scripts'));
      }

      // For every item in the config.libraries array, create a bundled js file in the dist folder
      for (var i = 0; i < config.libraries.length; i++) {
        var bundle = config.libraries[i],
            stream = compileJsLibs(
              bundle.sources, bundle.name + '.js',
              config.defaultDest,
              bundle.minify
            );

        if (i === 0) {
          mergedStream = mergeStream(stream);
        }
        else {
          mergedStream.add(stream);
        }
      }

      return mergedStream;
    };
  }
};
