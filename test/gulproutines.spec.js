'use strict'

require('./setup.js');

let utils = require('../core/utils.js')
  , gulp = require('gulp')
  , sinon = require('sinon')
  , GulpRoutines = require('../core/gulproutines.js')
  ;

describe('As a developer I want to have a set of tools routines to automatize tasks.\n', function() {
  context('Scenario:\n\tThe gulp routines file exists.', function() {
    let config = {
          ignore_prefix: "__"
        }
      , basePath = __dirname + "/fake"
      ;
    describe('Given the developer need to compile less files', function () {
      describe('When the developer instance the gulp routines', function () {
        it('Then will have a method that return all routine names.', function () {
          let gr = new GulpRoutines(basePath, config);
          expect(gr.getRoutineNames).to.exists;
          let rnms = gr.getRoutineNames();
          expect(rnms.length).to.be.equals(6);
        });
      });
      describe('When the developer call a function', function () {
        it('Then will have a less function.', function () {
          let gr = new GulpRoutines(basePath, config);
          expect(gr.getRoutine('less')).to.exists;
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a less files.', function () {
          let spy = sinon.spy(gulp, 'dest')
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.getRoutine('less')();
          expect(spy.called).to.be.true;
          gulp.dest.restore();
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a sass files.', function () {
          let gr = new GulpRoutines(basePath, config);
          expect(gr.getRoutine('sass')).to.exists;
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a sass files.', function () {
          let spy = sinon.spy(gulp, 'dest')
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.getRoutine('sass')();
          expect(spy.called).to.be.true;
          gulp.dest.restore();
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a stylus files.', function () {
          let gr = new GulpRoutines(basePath, config);
          expect(gr.getRoutine('stylus')).to.exists;
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a stylus files.', function () {
          let spy = sinon.spy(gulp, 'dest')
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.getRoutine('stylus')();
          expect(spy.called).to.be.true;
          gulp.dest.restore();
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a es6 files.', function () {
          let gr = new GulpRoutines(basePath, config);
          expect(gr.getRoutine('es6')).to.exists;
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a es6 files.', function () {
          let spy = sinon.spy(gulp, 'dest')
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.getRoutine('es6')();
          expect(spy.called).to.be.true;
          gulp.dest.restore();
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a assets files.', function () {
          let gr = new GulpRoutines(basePath, config);
          expect(gr.getRoutine('assets')).to.exists;
        });
      });
      describe('When the developer call a function', function () {
        it('Then will compile a assets files.', function () {
          let spy = sinon.spy(gulp, 'dest')
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.getRoutine('assets')();
          expect(spy.called).to.be.true;
          gulp.dest.restore();
        });
      });
      describe('When the developer call a function that execute a css prerpocessor acording the config', function () {
        it('Then will compile files according to the extenssion.', function (done) {
          let config = {
                ignore_prefix: '__',
                preprocessor: 'less'
              }
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.routines['less'] = function(){
              done();
          }
          gulp.tasks = {};
          gulp.tasks['less'] = {};
          gulp.tasks['less']['fn'] = gr.routines['less'];
          gr.getRoutine('stylesprepro')();
        });
      });
      describe('When the developer call a function that execute a css prerpocessor acording the config', function () {
        it('Then will compile files according to the extenssion.', function (done) {
          let config = {
                ignore_prefix: '__',
                preprocessor: 'sass'
              }
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.routines['sass'] = function(){
              done();
          }
          gulp.tasks = {};
          gulp.tasks['sass'] = {};
          gulp.tasks['sass']['fn'] = gr.routines['sass'];
          gr.getRoutine('stylesprepro')();
        });
      });
      describe('When the developer call a function that execute a css prerpocessor acording the config', function () {
        it('Then will compile files according to the extenssion.', function (done) {
          let config = {
                ignore_prefix: '__',
                preprocessor: 'stylus'
              }
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.routines['stylus'] = function(){
              done();
          }
          gulp.tasks = {};
          gulp.tasks['stylus'] = {};
          gulp.tasks['stylus']['fn'] = gr.routines['stylus'];
          gr.getRoutine('stylesprepro')();
        });
      });
      describe('When the developer need use the routines execute the method assembleRoutines', function () {
        it('Then will build gulp tasks.', function () {
          let spy = sinon.spy(gulp, 'task')
            , gr = new GulpRoutines(basePath, config)
            ;
          gr.assembleRoutines(gulp)
          expect(spy.called).to.be.true;
          gulp.task.restore();
        });
      });
    });
  });
});
