module.exports = function (gulp, plugins, config) {
  return function () {
    function templateCache(src, moduleName) {
      plugins.util.log(
        plugins.util.colors.blue('Placing templates of ' +
        (moduleName ? 'module ' + moduleName : 'main app') +
        ' in templateCache...'
      ));
      if (!moduleName) {
        moduleName = config.angular.appName;
      }

      return gulp.src(plugins.path.join(src, '/*.html'))
        .pipe(plugins.minifyHtml({
          empty: true,
          spare: true,
          quotes: true
        }))
        .pipe(plugins.angularTemplatecache(moduleName,
          {
            module: moduleName,
            root: 'templates'
          }
        ))
        .pipe(plugins.concat(moduleName + '.tmpl.js'))
        .pipe(gulp.dest(config.defaultDest + '/templates'));
    }

    try {
      var folders = plugins.getFolders('tmp/modules');
      if (folders || folders[0] === 'undefined') {
        var moduleTemplatesStream = folders.map(function (folder) {
          return templateCache('tmp/modules/' + folder, folder);
        });

        var mainTemplatesStream = templateCache('tmp');

        return plugins.mergeStream(mainTemplatesStream, moduleTemplatesStream);
      }
      else {
        return templateCache('tmp');
      }
    }
    catch (err) {
      return templateCache('tmp');
    }
  };
};
