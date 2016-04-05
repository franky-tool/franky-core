'use strict'

require('./setup.js');

let Logger = require('../core/logger.js')
  ;

describe('As a developer I want to instantiate a logger so that write important information.\n', function() {
  context('Scenario:\n\tThe logger class exists.', function() {
    let logger;
    beforeEach(function () {
      logger = new Logger('info'); 
    });
    describe('Given the developer can instantiate the logger', function () {
      describe('When the setIO method is called with a output buffers', function () {
        it('Then change the logger buffers used in logging actions.', function (done) {
          logger.setIO({
            stdout: {
              write:function(msg){
                done();
              }
            }, stderr: {
              write:function(){}
            }
          });
          logger.debug("test");
        });
      });
      describe('When the info method is called with an message as parameter', function () {
        it('Then an info message is sent to the output buffer.', function (done) {
          let message = "sample message";
          logger.setIO({
            stdout: {write:function(msg){
              expect(msg).to.contain(message);
              logger.setVerboseEnabled(false);
              done();
            }},
            stderr: {write:function(){}}
          });
          logger.setVerboseEnabled(true);
          logger.info(message);
        });
      });
      describe('When the debug method is called with an message as parameter', function () {
        it('Then an debug message is sent to the output buffer.', function (done) {
          let message = "sample message";
          logger.setIO({
            stdout: {write:function(msg){
              expect(msg).to.contain(message);
              done();
            }},
            stderr: {write:function(){}}
          });
          logger.setVerboseEnabled(false);
          logger.debug(message);
        });
      });
      describe('When the success method is called with an message as parameter', function () {
        it('Then an success message is sent to the output buffer.', function (done) {
          let message = "sample message";
          logger.setIO({
            stdout: {write:function(msg){
              expect(msg).to.contain(message);
              done();
            }},
            stderr: {write:function(){}}
          });
          logger.setVerboseEnabled(false);
          logger.success(message);
        });
      });
      describe('When the warning method is called with an message as parameter', function () {
        it('Then an warning message is sent to the output buffer.', function (done) {
          let message = "sample message";
          logger.setIO({
            stdout: {write:function(msg){
              expect(msg).to.contain(message);
              done();
            }},
            stderr: {write:function(){}}
          });
          logger.setVerboseEnabled(false);
          logger.warning(message);
        });
      });
      describe('When the notice method is called with an message as parameter', function () {
        it('Then an notice message is sent to the output buffer.', function (done) {
          let message = "sample message";
          logger.setIO({
            stdout: {write:function(msg){
              expect(msg).to.contain(message);
              done();
            }},
            stderr: {write:function(){}}
          });
          logger.setVerboseEnabled(false);
          logger.notice(message);
        });
      });
      describe('When the critical method is called with an message as parameter', function () {
        it('Then an critical message is sent to the output buffer.', function (done) {
          let message = "sample message";
          logger.setIO({
            stdout: {write:function(msg){
            }},
            stderr: {write:function(msg){
              expect(msg).to.contain(message);
              logger.setVerboseEnabled(false);
              done();
            }}
          });
          logger.setVerboseEnabled(true);
          logger.critical(message);
        });
      });
      describe('When the error method is called with an message as parameter', function () {
        it('Then an error message is sent to the output buffer.', function (done) {
          let message = "sample message";
          logger.setIO({
            stdout: {write:function(msg){
            }},
            stderr: {write:function(msg){
              expect(msg).to.contain(message);
              logger.setVerboseEnabled(false);
              done();
            }}
          });
          logger.setVerboseEnabled(true);
          logger.error(message);
        });
      });
      describe('When the error method is called with an error as message as parameter', function () {
        it('Then an error message is sent to the output buffer.', function (done) {
          let message = "sample message"
            , error = new Error(message)
            ;
          logger.setIO({
            stdout: {write:function(msg){
            }},
            stderr: {write:function(msg){
              expect(msg).to.contain(message);
              logger.setVerboseEnabled(false);
              done();
            }}
          });
          logger.setVerboseEnabled(true);
          logger.error(error);
        });
      });
      describe('When the critical method is called with an error as message as parameter', function () {
        it('Then an critical message is sent to the output buffer.', function (done) {
          let message = "sample message"
            , error = new Error(message)
            ;
          logger.setIO({
            stdout: {write:function(msg){
            }},
            stderr: {write:function(msg){
              expect(msg).to.contain(message);
              logger.setVerboseEnabled(false);
              done();
            }}
          });
          logger.setVerboseEnabled(true);
          logger.critical(error);
        });
      });
      describe('When the default logger instance is used to write a message', function () {
        it('Then a message is sent to the output buffer.', function (done) {
          let logger = Logger.logger
            , message = "test"
            ;
          logger.setIO({
            stdout: {write:function(msg){
              expect(msg).to.contain(message);
              logger.setVerboseEnabled(false);
              done();
            }},
            stderr: {write:function(msg){
            }}
          });
          logger.setVerboseEnabled(true);
          Logger.log(message);
        });
      });
    });
  });
});