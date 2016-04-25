'use strict'

let fs = require('fs')
  , utils = require('./utils.js')
  , gulp = utils.requireModule('gulp')
  , less = utils.requireModule('gulp-less')
  , sass = utils.requireModule('gulp-sass')
  , gutil = utils.requireModule('gulp-util')
  , babel = utils.requireModule('gulp-babel')
  , stylus = utils.requireModule('gulp-stylus')
  , gulpIgnore = utils.requireModule('gulp-ignore')
  , prefix = utils.requireModule('gulp-autoprefixer')
  , sourcemaps = utils.requireModule('gulp-sourcemaps')
  , gulpLiveServer = utils.requireModule('gulp-live-server')
  ;
function GulpRoutines(basePath, config, debug) {
  let ignored = '**/'+config.ignore_prefix+'*.*'
    , src = config.sources
    , pub = config.statics
    , app = basePath
    , templates = config.templates
    , SEP = config.sep
    , mainFile = config.mainFile||"index.js"
    , server
    , jsSourcePath = [app, src, 'js/**/*.js'].join(SEP)
    , lessSourcePath = [app, src, 'styles/**/*.less'].join(SEP)
    , sassSourcePath = [app, src, 'styles/**/*.scss'].join(SEP)
    , stylusSourcePath = [app, src, 'styles/**/*.styl'].join(SEP)
    ;
  debug = !!debug;
  debug&&gutil.log("JS Source Path:", jsSourcePath);
  debug&&gutil.log("Less Source Path:", lessSourcePath);
  debug&&gutil.log("Sass Source Path:", sassSourcePath);
  debug&&gutil.log("Stylus Source Path:", stylusSourcePath);
  this.routines = {
    'es6': function GulpRoutines_es6() {
      gulp.src(jsSourcePath)
      .pipe(gulpIgnore.exclude(ignored))
      .pipe(gulpIgnore.exclude('**/**.min.js'))
      .pipe(sourcemaps.init())
      .pipe(babel({
          presets: ['es2015']
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest([app, pub, 'js'].join(SEP)))
      ;
    },

    'assets': function GulpRoutines_assets() {
      gulp.src([app, src, 'assets/**/*'].join(SEP))
      .pipe(gulp.dest([app, pub, 'assets/'].join(SEP)));
    },

    'less': function GulpRoutines_less() {
      gulp.src(lessSourcePath)
      .pipe(gulpIgnore.exclude(ignored))
      .pipe(sourcemaps.init())
      .pipe(less())
      .on('error', function (test) {
        console.log(test);
      })
      .pipe(prefix(['last 3 versions'], { cascade: true }))
      .pipe(gulp.dest([app, pub, 'css/'].join(SEP)))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest([app, pub, 'css'].join(SEP)))
      ;
    },

    'sass': function GulpRoutines_sass() {
      gulp.src(sassSourcePath)
      .pipe(gulpIgnore.exclude(ignored))
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(prefix(['last 3 versions'], { cascade: true }))
      .pipe(gulp.dest([app, pub, 'css/'].join(SEP)))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest([app, pub, 'css'].join(SEP)))
      ;
    },

    'stylus': function GulpRoutines_stylus() {
      gulp.src(stylusSourcePath)
      .pipe(gulpIgnore.exclude(ignored))
      .pipe(sourcemaps.init())
      .pipe(stylus())
      .pipe(prefix(['last 3 versions'], { cascade: true }))
      .pipe(gulp.dest([app, pub, 'css/'].join(SEP)))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest([app, pub, 'css'].join(SEP)))
      ;
    },

    'stylesprepro': function GulpRoutines_stylesprepro() {
      switch(config.preprocessor.toLowerCase()){
      case "less":
        debug&&gutil.log("Using less as styles preprocessor");
        gulp.tasks['less']["fn"]();
        break;
      case "sass":
        debug&&gutil.log("Using sass as styles preprocessor");
        gulp.tasks['sass']["fn"]();
        break;
      case "stylus":
        debug&&gutil.log("Using sass as styles preprocessor");
        gulp.tasks['stylus']["fn"]();
        break;
      }
    },
    'serve': [['watch'], function GulpRoutines_serve() {
      server = gulpLiveServer(mainFile); 
      server.start();
    }],
    'watch': function GulpRoutines_watch() {
      let htmlsPath = [app, templates, '**/*.html'].join(SEP)
        , stylesPath = [app, pub, 'css', '**/*.css'].join(SEP)
        , scriptsPath = [app, pub, 'js', '**/*.js'].join(SEP)
        ;
      debug&&gutil.log(htmlsPath);
      debug&&gutil.log(stylesPath);
      debug&&gutil.log(scriptsPath);
      gulp.watch([app, src, 'styles', '**/*'].join(SEP), ['stylesprepro']);
      gulp.watch([app, src, 'js', '**/*.js'].join(SEP), ['es6']);
      gulp.watch(htmlsPath, function htmlReload(file) {
        debug&&gutil.log('Reload html file...');
        if(!!server){
          fs.stat(htmlsPath.split('**')[0], function(err, stats) {
            let TO = 1000;
            if(!err){
              TO = stats['size']*2;
            }
            debug&&gutil.log('Waiting for '+TO+" ms...");
            setTimeout(function() {
              debug&&gutil.log("done ...");
              server.notify.call(server, file);
            }, TO);
          });
        }
      });
      gulp.watch(stylesPath, function cssReload(file) {
        debug&&gutil.log('Reload css file...');
        if(!!server){
          server.notify.call(server, file);
        }
      });
      gulp.watch(scriptsPath, function jsReload(file) {
        debug&&gutil.log('Reload js file...');
        if(!!server){
          server.notify.call(server, file);
        }
      });
    },
    'default': [['es6','stylesprepro', 'serve']]
  }
}

/**
 * Return a specified routine
 */
GulpRoutines.prototype.getRoutine = function GulpRoutines_getRoutine(name) {
  return this.routines[name];
}

/**
 * Return the names of stored routines.
 */
GulpRoutines.prototype.getRoutineNames = function GulpRoutines_getRoutinenames() {
  return Object.keys(this.routines);
}

/**
 * Assemble the gulp routines
 */
GulpRoutines.prototype.assembleRoutines = function GulpRoutines_assembleRoutines(gulp_inst) {
  gulp_inst = gulp_inst || gulp;
  gulp = gulp_inst;
  for(let taskName in this.routines){
    let routine = this.routines[taskName];
    if( Object.prototype.toString.call( routine ) === '[object Array]' ) {
      let args = [taskName].concat(routine);
      gulp.task.apply(gulp, args);  
    } else {
      gulp.task(taskName, routine);
    }
  }
}

module.exports = GulpRoutines;
  
