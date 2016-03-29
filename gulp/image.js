module.exports = function(gulp, plugins, config) {
  return function() {
    gulp.src(config.assetsSrc + '/img/**')
      .pipe(plugins.imagemin({
        progressive: true
      }))
      .pipe(gulp.dest(config.defaultDest + '/img'));
  };
};
