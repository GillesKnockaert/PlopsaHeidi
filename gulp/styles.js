var gulp          = require('gulp'),
    sourcemaps    = require('gulp-sourcemaps'),
    sass          = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    concat        = require('gulp-concat'),
    minifyCss     = require('gulp-minify-css'),
    browserSync   = require('browser-sync');

module.exports = {
  compileCss: function(config) {
    // Add extra stylesheets
    var cssPaths = [config.assetsSrc + '/**/*.scss'];
    if (config.extraStylesheets) {
      for (var j = 0; j < config.extraStylesheets.length; j++) {
        cssPaths.push(config.extraStylesheets[j]);
      }
    }

    return gulp.src(cssPaths)
      .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass())
        .pipe(autoprefixer('> 5%'))
        .pipe(concat('main.css'))
        .pipe(minifyCss())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(config.defaultDest + '/styles'));
  }
};
