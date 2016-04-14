'use strict'

require('./setup.js');

let ControllersManager = require('../core/controllermanager.js')
  , utils = require('../core/utils.js')
  , Logger = require('../core/logger.js')
  , sinon = require('sinon')
  , fs = require('fs')
  ;
  
describe('As a developer I want to instantiate an element for load controllers.\n', function() {
  context('Scenario:\n\tThe controllermanager class exists.', function() {
    describe('Given the controller manager exists', function () {
      let testControllers = __dirname+'/fake/controllers'
        , fakeApp = {
          get: ()=>{},
          post: ()=>{},
          put: ()=>{},
          delete: ()=>{},
        }
        , fakeServer = {
          getApplication: function fakeGetApplication(){
            return fakeApp;
          },
          getScope: ()=>{ return {}; }
        }
        , lastMessage
        , lastError
        ;
      beforeEach(()=>{
          Logger.logger = new Logger("info");
          Logger.logger.setIO({
              stdout: {
                  write: function fakeStdOut(message){
                    lastMessage = message;
                  }
              },
              stderr: {
                  write: function fakeStdErr(message){
                    lastError = message;
                  }
              }
          });
          Logger.logger.setVerboseEnabled(true);
      });
      afterEach(()=>{
          Logger.logger = new Logger("info");
          try {
              utils.requireModule.restore();
          } catch (error) {}
          try {
              utils.getFilesList.restore();
          } catch (error) {}
          try {
              Logger.logger.io.stderr.restore();
          } catch (error) {}
      });
      describe('When the developer instance it without a base path', function () {
        it('Then get a instance with loadControllers method.', function () {
          try {
            let cm = new ControllersManager();
          } catch (error) {
            expect(error.message).to.equal('server is not defined.');
          }
        });
      });
      describe('When the developer instance it without a base path', function () {
        it('Then get a instance with loadControllers method.', function () {
          try {
            let cm = new ControllersManager(fakeServer);
          } catch (error) {
            expect(error.message).to.equal('basePath is not defined.');
          }
        });
      });
      describe('When the developer instance it with a base path', function () {
        it('Then get a instance with loadControllers method.', function () {
          let cm = new ControllersManager(fakeServer, testControllers);
          expect(cm.loadControllers).to.exist;
        });
      });
      describe('When the developer call the loadControllers method', function () {
        it('Then use ls function from utils module.', function (done) {
          let cm = new ControllersManager(fakeServer, testControllers)
            , stub = sinon.stub(utils, "ls", function(path){
                expect(path).to.be.equals(testControllers);
                utils.ls.restore();
                done();
              })
            ;
          cm.loadControllers();
        });
      });
      describe('When the developer instance it with a base path', function () {
        it('Then get a instance with injectModule method.', function () {
          let cm = new ControllersManager(fakeServer, testControllers);
          expect(cm.injectModule).to.exist;
        });
      });
      describe('When the developer instance it with a base path', function () {
        it('Then get a instance with injectModule method.', function () {
          let cm = new ControllersManager(fakeServer, testControllers);
          expect(cm.injectModule).to.exist;
        });
      });
      describe('When the developer instance it with a base path', function () {
        it('Then get a instance with loadControllerModule method.', function () {
          let cm = new ControllersManager(fakeServer, testControllers);
          expect(cm.loadControllerModule).to.exist;
        });
      });
      describe('When the developer call the loadControllers method', function () {
        it('Then use loadControllerModule function from instance.', function (done) {
          let cm = new ControllersManager(fakeServer, testControllers)
            , stub = sinon.stub(cm, "loadControllerModule", function(path){
                expect(path).to.be.equals(testControllers+'/samplecontroller.js');
                cm.loadControllerModule.restore();
                done();
              })
            ;
          cm.loadControllers();
        });
      });
      describe('When the developer call the loadControllers method', function () {
        it('Then use requireModule function of utils module.', function (done) {
          let cm = new ControllersManager(fakeServer, testControllers)
            , stub = sinon.stub(utils, "requireModule", function(path){
                expect(path).to.be.equals(testControllers+"/samplecontroller.js");
                expect(lastMessage).to.contains('Importing '+testControllers+"/samplecontroller.js");
                done();
              });
            ;
          cm.loadControllers();
        });
      });
      describe('When the developer call the loadController method with invalid module name as parameter', function () {
        it('Then will write an error message.', function () {
          let cm = new ControllersManager(fakeServer, testControllers)
            , modName = __dirname+"/fake/badcontrollers/superbadcontroller.js"
            ;
          cm.loadControllerModule(modName);
          expect(lastError).to.contains('Invalid module '+modName);
        });
      });
      describe('When the developer call the loadControllers method from controllermanager instance', function () {
        it('Then iterate over array of path provided by the controller', function () {
          let cm = new ControllersManager(fakeServer, testControllers)
            ;
          lastError = undefined;
          cm.loadControllers();
          expect(lastMessage).to.contains('Importing '+testControllers+"/samplecontroller.js");
          expect(lastError).to.be.undefined;
        });
      });
      describe('When the developer call the loadControllers method from controller instance', function () {
        it('Then inject a controller module paths and functions into express application', function (done) {
          let anotherFakeApp = {}
            , anotherFakeServer = {
              getApplication: function anotherFakeMethod(){
                return anotherFakeApp;
              },
              getScope: ()=>{
                  return {};
              }
            }
            , cm = new ControllersManager(anotherFakeServer, testControllers)
            ;
          anotherFakeApp.get = function(url, callableElm){
            expect(url).to.contains('/');
            done();
          };
          cm.loadControllers();
        });
      });
    });
  });
});

