module.exports = function(gulp, plugins, config) {
  return function() {
    var moveHtmlStream = gulp.src([
        config.assetsSrc + '/**/*.html',
        '!' + config.assetsSrc + '/index.html'
      ])
      .pipe(gulp.dest(config.defaultDest));

    // Place all templates in the tmp folder to get read in by the templateCache task
    var moveHtmlTemplatesStream = gulp.src(config.angular.angularSrc + '/templates/**/*.html')
      .pipe(gulp.dest('tmp'));

    return plugins.mergeStream(moveHtmlStream, moveHtmlTemplatesStream);
  };
};
