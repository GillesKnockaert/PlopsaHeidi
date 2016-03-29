module.exports = function(gulp, plugins, config) {
  return function(cb) {

    var browserSyncConfig = {
      port: config.serve.port
    };

    if (config.serve.isProxy) {
      browserSyncConfig.proxy = {
        target: config.serve.proxyTarget,
        ws: config.serve.websockets
      };
    }
    else {
      browserSyncConfig.server = {
        baseDir: config.defaultDest + '/'
      };
    }

    plugins.browserSync.init(browserSyncConfig);

    // create a task that ensures the `scripts` task is complete before reloading browsers
    gulp.task('js-watch', ['scripts'], plugins.browserSync.reload);
    gulp.watch([config.angular.angularSrc + '/**/*.js', config.assetsSrc + '/js/**/*.js'], ['js-watch']);

    // Watch sass files for changes
    gulp.watch(config.assetsSrc + '/styles/**/*.scss', ['styles']);

    // Watch main html files for changes
    gulp.watch(config.assetsSrc + '/*.html', ['compile-templates']);

    // Watch html files for changes
    gulp.watch(config.angular.angularSrc + '/templates/**/*.html', ['templateCache']).on('change', plugins.browserSync.reload);
  };
};
