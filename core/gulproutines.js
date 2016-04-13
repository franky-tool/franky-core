'use strict'

let gulp = require('gulp')
  , less = require('gulp-less')
  , sass = require('gulp-sass')
  , gutil = require('gulp-util')
  , babel = require('gulp-babel')
  , stylus = require('gulp-stylus')
  , gulpIgnore = require('gulp-ignore')
  , prefix = require('gulp-autoprefixer')
  , sourcemaps = require('gulp-sourcemaps')
  , gulpLiveServer = require('gulp-live-server')
  ;
  
function GulpRoutines(basePath, config) {
  let ignored = '**/'+config.ignore_prefix+'*.*'
    , src = config.sources
    , pub = config.statics
    , app = basePath
    , templates = config.templates
    , SEP = config.sep
    ;
  this.routines = {
    'es6': function GulpRoutines_es6() {
        gulp.src([app, src, 'js/**/*.js'].join(SEP))
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
        gulp.src([app, src, 'styles/*.less'].join(SEP))
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
        gulp.src([app, src, 'styles/*.scss'].join(SEP))
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
        gulp.src([app, src, 'styles/*.styl'].join(SEP))
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
            gutil.log("Using less as styles preprocessor");
            gulp.tasks['less']["fn"]();
            break;
        case "sass":
            gutil.log("Using sass as styles preprocessor");
            gulp.tasks['sass']["fn"]();
            break;
        case "stylus":
            gutil.log("Using sass as styles preprocessor");
            gulp.tasks['stylus']["fn"]();
            break;
        }
    }
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
    gulp.task(taskName, routine);
  }
}

module.exports = GulpRoutines;
  