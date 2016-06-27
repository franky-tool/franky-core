'use strict'

require('./setup.js');

let request = require('supertest')
  , express = require('express')
  , Server = require("../core/server.js")
  , Logger = require('../core/logger.js')
  ;

describe('As a developer I want to instantiate a server so that dispatch the browser requested files.\n', function() {
  context('Scenario:\n\tThe server structure exists.', function() {
    let server
      , CONFIG = {
          port: parseInt(Math.random()*10000+1024, 10),
          "sources":"src",
          "statics": "public",
          "templates": "templates",
          "plugins": "plugins",
          "database": {
            "name": "data"
          },
        "sep": "/"
        }
        , lastMessage
        , lastError
      ;
    beforeEach(function() {
      server = new Server(__dirname+"/fake", false, CONFIG);
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
    afterEach(function() {
      try {
        server.getApplication().close();
      } catch (error) {
        
      }
    });
    describe('Given that the developer can instantiate a server', function () {
      describe('When the developer instantiate and pass the base path', function () {
        it('Then update the server base path.', function () {
          /*
          let server = new Server(__dirname, CONFIG);
          expect(server.getBasePath).to.exist;
          expect(server.getBasePath()).to.be.equal(__dirname);
          */
        });
      });
    });
    describe('Given that developer can create a server instance', function () {
      describe('When the developer call the method getApplication', function () {
        it('Then an instance of express server is returned.', function () {
          var inst = server.getApplication();
          expect(inst).to.not.be.null;
          expect(inst.get).to.not.be.null;
          expect(inst.post).to.not.be.null;
          expect(inst.put).to.not.be.null;
          expect(inst.delete).to.not.be.null;
        });
      });
      describe('When the configuration is changed', function () {
        it('Then update the configuration data', function () {
          server.setConfiguration({
            port: 8965
          });
          expect(server.getConfiguration().port).to.be.equal(8965);
        });
      });
      describe('When the server is initialized', function () {
        it('Then call the onListen method.', function () {
          server.setConfiguration(
            {
              port: 3000
            }
          );
          server.start();
        });
      });
      describe('When the server receive a request with path /', function () {
          it('Then response with content of template index.html', function () {
            
          });
      });
    });
  });
});

