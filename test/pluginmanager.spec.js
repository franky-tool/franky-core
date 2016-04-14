'use strict'

require('./setup.js');

let PluginsManager = require('../core/pluginmanager.js')
  , utils = require('../core/utils.js')
  , Logger = require('../core/logger.js')
  , sinon = require('sinon')
  , fs = require('fs')
  ;
  
describe('As a developer I want to extend my application with a plugins.\n', function() {
  context('Scenario:\n\tThe pluginmanager class exists.', function() {
    let lastCallable 
      , scope = {}
      , fakeServer = {
        getConfiguration: function fakeGetConfig(){
          return {
            sep: "/",
            plugins: "plugins"
          }
        },
        addToScope: (a, b)=>{
            scope[a] = b;
        },
        getScope: ()=>{
          return scope;  
        },
        getApplication: function fakeGetApplication() {
            return {
              get: function fakeGet(url, action) {
                
              },
              post: function fakeGet(url, action) {
                
              },
              put: function fakeGet(url, action) {
                
              },
              delete: function fakeGet(url, action) {
                
              },
              use: function fake_use_express(callable) {
                lastCallable = callable;
              }
            };
          }
        }
      , basePath = __dirname+'/fake'
      ;
    describe('Given the module exists', function () {
      describe('When the developer try to instantiate it without a base path and server instance', function () {
        it('Then raise a error.', function (done) {
          try {
            let pm = new PluginsManager();
          } catch (error) {
            expect(error.message).to.be.equal('basePath is not defined.');
            done();
          }
        });
      });
      describe('When the developer try to instantiate it without a server instance', function () {
        it('Then raise a error.', function (done) {
          try {
            let pm = new PluginsManager(basePath)
              ;
          } catch (error) {
            expect(error.message).to.be.equal('serverInstance is not defined.');
            done();
          }
        });
      });
      describe('When the developer try to instance it', function () {
        it('Then will be create a new instance of module.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            ;
        });
      });
      describe('When the developer try to instance it', function () {
        it('Then will be create a new instance of module and it will have a method loadPlugin.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            ;
          expect(pm.loadPlugin).to.exist;
        });
      });
      describe('When the developer try to instance it', function () {
        it('Then will call the method loadPlugin without parameters an exception will be raised.', function (done) {
          try {
            let pm = new PluginsManager(basePath, fakeServer)
              ;
            pm.loadPlugin();
          } catch (error) {
            expect(error.message).to.be.equal('pluginName is not defined.');
            done();
          }
        });
      });
      describe('When the developer try to instance it', function () {
        it('Then will be create a new instance of module and it will have a method loadMiddlewarePlugin.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            ;
          expect(pm.loadMiddlewarePlugin).to.exist;
        });
      });
      describe('When the developer load a middleware plugin', function () {
        it('Then the method loadMiddlewarePlugin will be called.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            , spy = sinon.spy(pm, "loadMiddlewarePlugin")
            ;
            pm.loadPlugin('middleware');
            expect(spy.calledOnce).to.be.true;
            pm.loadMiddlewarePlugin.restore();
        });
      });
      describe('When the developer load a middleware plugin using loadMiddlewarePlugin with a invalid plugin type', function () {
        it('Then raise an error.', function (done) {
          let pm = new PluginsManager(basePath, fakeServer)
            ;
          try {
            pm.loadMiddlewarePlugin({type:'invalid_type'});
          } catch (error) {
            expect(error.message).to.contains('invalid plugin type');
            done();
          }
        });
      });
      describe('When the developer load a middleware plugin using loadMiddlewarePlugin with a valid plugin type', function () {
        it('Then call use method from express aplication form server.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            ;
            pm.loadMiddlewarePlugin({
              type:'middleware',
              callable: function fakeCallable(req, rest) {}
            });
            expect(lastCallable.name).to.be.equal('fakeCallable');
        });
      });
      describe('When the developer try to instance it', function () {
        it('Then will be create a new instance of module and it will have a method loadPlugins.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            ;
          expect(pm.loadPlugins).to.exist;
        });
      });
      describe('When the developer load all plugins with the method loadPlugins', function () {
        it('Then the method loadPlugin will be called.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            , spy = sinon.spy(pm, "loadPlugin")
            ;
            pm.loadPlugins();
            expect(spy.called).to.be.true;
        });
      });
      describe('When the developer load a commandline plugin', function () {
        it('Then call the method loadCommandlinePlugin.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            , spy = sinon.spy(pm, "loadCommandlinePlugin")
            ;
            pm.loadCommands();
            expect(spy.calledOnce).to.be.true;
        });
      });
      describe('When the developer try to instance it', function () {
        it('Then will be create a new instance of module and it will have a method processAll.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            ;
          expect(pm.processAll).to.exist;
        });
      });
      describe('When the developer load all commandline plugins', function () {
        it('Then process all pending plugins.', function (done) {
          let pm = new PluginsManager(basePath, fakeServer)
            , EXPECTED = "$%&/()=)(/&)"
            , fakeArgsParser = {
              get: (value)=>{
                switch (value) {
                    case 'sample':
                      return EXPECTED;
                    default:
                      return true;
                  }
                }
              }
            ;
            pm.processPending = {
              "sample":{
                "callable": (w)=>{
                  expect(w).to.be.equals(EXPECTED);
                  done();
                },
                "type": "commandline",
                "bind": true,
                "options":{
                  "exit": true,
                  "execute": true,
                  "include": true
                },
                "command":{
                  "value": "-s, --sample <name>",
                  "help":"sample help",
                  "preprocessor": (val)=>val.toUpperCase(),
                  "initial": null
                }
              }
            }
            pm.processAll(fakeArgsParser);
        });
      });
      describe('When the developer load all commandline plugins', function () {
        it('Then process all pending plugins.', function (done) {
          let pm = new PluginsManager(basePath, fakeServer)
            , EXPECTED = "$%&/()=)(/&)"
            , fakeArgsParser = {
              get: (value)=>{
                switch (value) {
                    case 'sample':
                      return EXPECTED;
                    default:
                      return true;
                  }
                }
              }
            ;
            pm.processPending = {
              "sample":{
                "callable": ()=>{
                  done();
                },
                "type": "commandline",
                "bind": true,
                "options":{
                  "exit": true,
                  "execute": true,
                  "include": true
                },
                "command":{
                  "value": "-s, --sample",
                  "help":"sample help",
                  "preprocessor": null,
                  "initial": null
                }
              }
            }
            pm.processAll(fakeArgsParser);
        });
      });
      describe('When the developer load all commandline plugins', function () {
        it('Then process all pending plugins.', function () {
          let pm = new PluginsManager(basePath, fakeServer)
            , EXPECTED = "$%&/()=)(/&)"
            , fakeArgsParser = {
              get: (value)=>{
                switch (value) {
                    case 'sample':
                      return EXPECTED;
                    default:
                      return true;
                  }
                }
              }
            ;
            pm.processPending = {
              "sample":{
                "callable": (w)=>{
                },
                "type": "commandline",
                "bind": true,
                "options":{
                  "exit": true,
                  "execute": false,
                  "include": true
                },
                "command":{
                  "value": "-s, --sample <name>",
                  "help":"sample help",
                  "preprocessor": (val)=>val.toUpperCase(),
                  "initial": null
                }
              }
            }
            delete scope.sample;
            pm.processAll(fakeArgsParser);
            expect(scope['sample']).to.exists;
        });
      });
    });
  });
});
