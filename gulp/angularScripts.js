module.exports = function(gulp, plugins, config) {
  return function() {
    // JS compile function
    // This is the main javascript compilation function.
    // src: the path to the javascript file(s). Optionally a glob pattern
    // filename: the name of the concatenated, optionally minified output file
    // dest: the destination path of the output file
    // Additional options, such as wether to lint, check code style or minify,
    // are supplied with the gulp.config.json file.

    function compileJs(src, filename, dest) {
      return gulp.src(src)
        .pipe(plugins.gulpif(config.verbose, plugins.print(function(filepath) {
          return 'running js-task on: ' + filepath;
        })))
        .pipe(plugins.gulpif(config.jscs, plugins.jscs()))
        .pipe(plugins.gulpif(config.jscs, plugins.jscs.reporter()))
        .pipe(plugins.gulpif(config.jshint, plugins.jshint()))
        .pipe(plugins.gulpif(
          config.jshint,
          plugins.jshint.reporter('jshint-stylish', { verbose: true }))
        )
        .pipe(plugins.gulpif(config.jshint, plugins.jshint.reporter('fail')))
        .pipe(plugins.concat(filename))
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.gulpif(config.sourceMaps, plugins.sourcemaps.init({ loadMaps: true })))
          .pipe(plugins.gulpif(config.minify, plugins.uglify()))
          .on('error', plugins.util.log)
        .pipe(plugins.gulpif(config.sourceMaps, plugins.sourcemaps.write('./')))
        .pipe(gulp.dest(dest + '/scripts'));
    }

    // The mergedStream variable will contain all the seperate gulp javascript
    // streams this task will produce. (i.e. seperate streams for each angular
    // module plus a stream for additional js code)
    var mergedStream;
    var folders = plugins.getFolders(config.angular.angularSrc + '/modules');

    // Config.angular.singleModule determines wether all angular modules should be compiled
    // to a single file (and then minified) or wether we want seperate files for
    // each module. In the latter case, the file name is based on the name of the
    // module folder. See README.md for more details.
    if (config.angular.singleModule) {
      plugins.util.log(plugins.util.colors.blue('Compiling all angular modules in a single file'));

      var srcArray = [
        config.angular.angularSrc + '/' + config.angular.appName + '.js',
        config.angular.angularSrc + '/common/**/*.js'
      ];

      for (var i = 0; i < folders.length; i++) {
        srcArray.push(plugins.path.join(config.angular.angularSrc, folders[i], '*.js'));
      }

      mergedStream = plugins.mergeStream(
        compileJs(srcArray, config.angular.appName + '.js', config.defaultDest)
      );
    }
    else {
      // Make a seperate stream for each angular module.
      // Uglify and concat the main angular app
      var mainAngularAppStream = compileJs([
          config.angular.angularSrc + '/' + config.angular.appName + '.js',
          config.angular.angularSrc + '/common/**/*.js'],
          config.angular.appName + '.js',
          config.defaultDest
        );

      // Make a gulp stream for each module in the src folder
      var moduleAngularStream = folders.map(function(folder) {
        plugins.util.log(plugins.util.colors.blue('Compiling angular module ' + folder)
      );

        // For each folder in the modules, concat and uglify all the js files and
        // save in a seperate js file.
        return compileJs(
          plugins.path.join(config.angular.angularSrc, 'modules', folder, '**', '*.js'),
          folder + '.js',
          config.defaultDest,
          true
        );
      });

      mergedStream = plugins.mergeStream(mainAngularAppStream, moduleAngularStream);
    }

    return mergedStream.isEmpty() ? null : mergedStream;
  };
};
