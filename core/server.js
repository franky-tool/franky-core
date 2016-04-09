'use strict'

let express = require('express')
  , bodyParser = require('body-parser')
  , nunjucks = require('nunjucks')
  , utils = require('./utils.js')
  , Logger = require('./logger')
  , ControllerManager = require('./controllermanager')
  , Storage = require('./storage.js')
  // , Generator = require('./generator')
  ;

function Server(basePath, customConfig) {
  /* istanbul ignore if */
  if(!basePath){
      _err('root path');
  }
  /* istanbul ignore if */
  if(!customConfig){
      customConfig = require(basePath+"/config.js");
  }
  let self = this
    ;
  this.basePath = basePath;
  this.application = express();
  this.config = customConfig;
  this.staticsFolder = [basePath, this.config.app, this.config.statics].join(this.config.sep)
  this.templatesFolder = [basePath, this.config.app, this.config.templates].join(this.config.sep)
  this.controller = new ControllerManager(this, this.basePath)
  this.storage = new Storage(this.config)
  // this.generator = new Generator(this, basePath)
}

Server.prototype.setConfiguration = function Server_setConfiguration(config) {
  this.config = config;
}

Server.prototype.getConfiguration = function Server_getConfiguration() {
  return this.config;
}

Server.prototype.getApplication = function Server_getApplication() {
  return this.application;
}

Server.prototype.getBasePath = function Server_getBasePath() {
  return this.basePath;
}

Server.prototype.onListen = function Server_onListen() {
  let PORT;
  /* istanbul ignore if */
  if(!!this.listener){
    PORT = ' at ' + this.listener.address().port;
  } else {
    PORT = ' and ready...'
  }
  Logger.log('success', 'Listening' + PORT);
  return true;    
}

Server.prototype.start = function Server_start() {
  let context = {};
  context.listener = this.listener = this.application.listen(this.config.port, this.onListen.bind(context));
  return this.listener; 
}

module.exports = Server;
