# bazookas-gulp

A collection of gulp-tasks, with configuration and examples.

## Installation

`npm install` and `bower install` should do the trick. Make sure you have node (with npm) and bower installed globally. Installing gulp globally is optional.

Javascript can optionally be linted and style checked. For style checking, we use [jscs](http://jscs.info/). It might be handy to install this globally and configure it with our IDE. If using atom, the *linter-jscs* package will do the trick.

Unit tests use Karma. If this is your first time using Karma, use the following command:
`npm install -g karma-cli`
This will allow you to just type `karma` in command line to run the local tests, instead of `./node_modules/karma/bin/karma start`.

## Config

The *gulp.config.json* file contains configuration options for the gulp workflow. The purpose of our gulp workflow is to create a folder (defined by **defaultDest**) with compiled code, ready for production. (this folder contains all code necessary to run the project, so we can simply place this on the server and keep our source code secure.)

**angular** - This object contains four possible properties.

**angular.isAngularProject** - Boolean flag to indicate wether this is a angular project. If true, the other three properties of the angular project are required. If not, you can safely omit them.

**angular.appName** - The name of the main angular app. Fill this in, it's important for templateCache. (unless, of course, this isn't an angular app.)

**angular.angularSrc** - the folder where the angular app is located.

**angular.singleModule** - When set to true, the main angular app and all it's modules will be compiled to a single minified .js file. If not, a seperate minified .js file is made for each module. (same goes for the templates)

**assetsSrc** - the folder with all additional assets (css, extra js, images) and the index.html.

**defaultDest** - the folder containing our compiled, final code, ready for deployment.

**extraLibraries** - We use [gulp-concat-vendor](https://github.com/patrickpietens/gulp-concat-vendor) to compile our libraries to a single minified libs.js file. This plugin compiles all libraries in the *vendor* folder which have a *bower.json* file. If a library doesn't have a *bower.json* file, you'll need to add the filepath to the .js file of the library in this **extraLibraries** array. Just add the path starting from (but not including) the *vendor* folder as a string to this array. (NOTE: When you can't add a library to the *vendor* folder with bower, you can of course copy paste it inside this folder. Don't forget to edit the .gitignore file with an exception for this library folder if you do this!)

**jscs** - Boolean to indicate wether to style check the js files using jscs. Check the .jscsrc file for the jscs settings.

**jshint** - Boolean to indicate wether to lint our javascript code.

**verbose** - Boolean to indicate wether to print out all the files going through each stream. Handy for debugging purposes.

**minify** - Boolean to indicate wether to minify the .js files.

**sourceMaps** - Boolean to indicate wether to use sourcemaps in css and js compilation/minification.

**serve** - The default serve object looks like this:

```
"serve": {
    "port": 8000,
    "isProxy": false,
    "proxyTarget": null,
    "websockets": false
  }
```
This tells browsersync to simply run the project on localhost:8000. Is you're also running a server (for example, a node server which serves all local files from localhost:3000), set the *isProxy* flag to true, and set *proxyTarget* to `localhost:3000`. In this situation, you should also add a nodemon task to gulp to run the node server locally. (This might be added later to this starter project when the need arises. We should also figure out a way to handle templates, and more specifically, `$templateCache`, using a server like this.)

## Folder structure

```
.
+-- angular
|   +-- common
	|   +-- controllers
	|   +-- directives
	|   +-- filters
	|   +-- services
|   +-- modules
	 |   +-- module1
		 |   +-- controllers
		 |   +-- directives
		 |   +-- filters
		 |   +-- services
	 |   +-- module2
	 	 ...
	 ...
|   +-- templates
|   +-- app.js
+-- assets
|   +-- img
|   +-- styles
|   +-- js
+-- gulp
+-- node_modules
+-- public
|   +-- img
|   +-- scripts
|   +-- styles
|   +-- templates
|   +-- index.html
+-- tests
+-- vendor
+-- .bowerrc
+-- .gitignore
+-- .jscsrc
+-- gulpfile.js
+-- gulp.config.json
+-- package.json
+-- README.md
```

### Angular

Only applies when **angular.isAngularProject** is set to true, of course.

The **angular** folder contains all our angular-specific code. We named this 'angular' to avoid conflicts with the symfony app folder in symfony projects. The **common** subdirectory contains all directives, controllers, filters and services used by our main 'root' angular module. This means functionality used throughout the app that don't benefit from further abstraction or seperation into it's own modules. In very large projects, it's desireable to use further subdirectories in **common**, each with their own **controllers**, **directives**, **filters** and **services** subdirectories.

The **modules** subdirectory contains all seperate angular modules of our app. Read [this article](http://henriquat.re/modularizing-angularjs/modularizing-angular-applications/modularizing-angular-applications.html) if you want to know why seperation into models is a good idea. Each module again follows the **controllers**, **directives**, **filters** and **services** subdirectory structure. Each modules subfolder should also contain a **moduleName.js** file which serves as the base file for this module. If it's a small module, the subdirectories might not be necessary.

The **templates** directory contains the *.jade* or *.html* templates our directives use as template. The gulp `build`and `serve`commands will take care of compiling these templates and injecting them in `$templateCache`. All templates in the root **templates** directory will be placed in the `$templateCache` of the angular app. Every subdirectory in **templates** points to a module. Make sure the names of these directories match those of the modules in **angular/modules**! The templates within each of these directories will then be placed in the `$templateCache` of that module.

**app.js** is the root of our angular project

###Assets

This folder contains additional assets. The **styles** subdirectory contains, of course, our styles (using sass). The **js** subdirectory contains any aditional js files used in the project. Try to uphold the *angular way* here and refrain from poluting the global scope!

**assets** also contains an *img* folder. All .jpeg, .png, .gif and .svg images in this folder will be optimized and placed in the *public* folder.

Finally, **assets** contains our index.jade file, which should not have to be explained any further.

###Gulp

This folder contains all seperated gulp tasks.

###node_modules

I'm using node modules mostly for dev dependencies (such as gulp, since some gulp plugins are not available through bower) and to clearly seperate our dev depencencies from our frontend libraries in the **assets/libs** folder.

###public

**angular** and **assets** will be compiled to this folder.

###tests

This folder contains all unit tests and E2E tests.

###vendor

The folder contains all our bower-installed libraries. (See **.bowerrc** for this configuration.) If you need to install a library which doesn't support bower, you can just add it to this folder and place an exception in the .gitignore file. Other options include a reference to a CDN within a script tag in the index.html or adding the desired files to the *assets/js* folder. When we upgrade this project to work with either ES6 via Babel or Typescript, the additional option of CommonJS-like module imports will become available.

## GULP

The following commands are available:

`gulp build` Builds the project to the *public* folder, with the following steps:

* compile sass to css
* uglify and concat the angular app
* uglify and concat additional javascript in the *assets/js* folder
* uglify and concat external libraries in the *vendor* folder
* compile the jade templates to html (or just use the html templates) and add them to the *$templateCache* with *gulp-angular-templatecache* (per module)
* Adds angular dependency injection, safe for minification.
* Optimize images in *assets/img* with [imagemin](https://github.com/sindresorhus/gulp-imagemin).

`gulp serve` Uses browsersync to serve the project and watch for changes

`gulp test` Runs the end-to-end tests with protractor

## Conventions and guidelines

Styles are written with [Sass](http://sass-lang.com/). I've included the standard Bazookas mixin file for basic sass mixins. Note that this mixin sheet contains some obsolete browser prefix mixins. You can forget about prefixes entirely in this project due to [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)

Note: Do not forget to enter your media-query breakpoints in the mixin file! (at part 3) This ensures consistent media queries.

It's possible to use the sass library [zen-grids](http://zengrids.com/) for a stand-alone grid layout, without relying on a large library such as foundation or twitter bootstrap.

Try to use seperate modules and seperation of concerns as much as possible with an angular project. Create re-usable modules when possible, and perhaps save them in a common bazookas repository for re-use in other projects.

Remember to always save newly added libraries to the package.json or bower.json files! Use the `--save` or `--save-dev` flag with the install commands.

For routing within the angular app, see [the ui-router documentation](https://github.com/angular-ui/ui-router/wiki). For all rest calls, you should use [Restangular](https://github.com/mgonto/restangular) (Of course, in a simple REST api scenario, `$http` service will works just fine. Don't forget to remove the Restangular library from *vendor*, bower.json and the angular dependency injection in your modules if this is the case!).

## Unit testing

We use both [Karma](http://karma-runner.github.io/0.13/intro/installation.html) and [Protractor](https://angular.github.io/protractor/#/) for unit tests. Karma's tests are written in [Mocha](https://mochajs.org/) and [Chai](http://chaijs.com/).

Since the subject seems to exhaustive to fully discuss here, and since I lack the experience to make any judgement on this, I'll just write a basic structure for testing and leave the rest to you. When we have some testing experience, we can come back on this. I suggest we focus on writing unit tests in services and filters, a well-written controller or directive shouldn't need these.

I've used [this tutorial](http://bendetat.com/karma-and-mocha-for-angular-testing.html) for basic karma/angular setup.

####Why both Karma and Protractor?
When do I use which?
Karma is a great tool for unit testing, and Protractor is intended for end to end or integration testing. This means that small tests for the logic of your individual controllers, directives, and services should be run using Karma. Big tests in which you have a running instance of your entire application should be run using Protractor. Protractor is intended to run tests from a user's point of view - if your test could be written down as instructions for a human interacting with your application, it should be an end to end test written with Protractor.
