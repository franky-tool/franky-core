'use strict'

let express = require('express')
  , bodyParser = require('body-parser')
  , nunjucks = require('nunjucks')
  , Logger = require('./logger')
  , utils = require('./utils.js')
  , Storage = require('./storage.js')
  , ArgsParser = require("./argsparser.js")
  , PluginManager = require('./pluginmanager')
  , ControllerManager = require('./controllermanager')
  ;

function Server(basePath, verbose, customConfig) {
  /* istanbul ignore if */
  if(!basePath){
      _err('root path');
  }
  let self = this
    , argsparser = new ArgsParser()
    ;
  this.scope = {
    "utils": utils,
    "Logger": Logger
  };
  this.verbose = (process.argv.indexOf('-v')>=0||process.argv.indexOf('--verbose')>=0) || !!verbose;
  /* istanbul ignore if */
  if(!customConfig){
      customConfig = require(basePath+"/config.js");
  }
  Logger.logger.setVerboseEnabled(this.isVerbose());
  this.basePath = basePath;
  this.config = customConfig;
  Logger.log('info', "Base path: "+this.basePath);
  this.sourcesFolder = [basePath, this.config.sources].join(this.config.sep)
  Logger.log('info', "Sources path: "+this.sourcesFolder);
  this.staticsFolder = [basePath, this.config.statics].join(this.config.sep)
  Logger.log('info', "Statics path: "+this.staticsFolder);
  this.templatesFolder = [basePath, this.config.templates].join(this.config.sep)
  Logger.log('info', "Templates path: "+this.templatesFolder);
  this.pluginsFolder = [basePath, this.config.plugins].join(this.config.sep)
  Logger.log('info', "Plugins path: "+this.pluginsFolder);
  this.controllersFolder = [basePath, this.config.controllers].join(this.config.sep)
  Logger.log('info', "Controllers path: "+this.controllersFolder);
  this.scope['sourcesFolder'] = this.sourcesFolder;
  this.scope['staticsFolder'] = this.staticsFolder;
  this.scope['templatesFolder'] = this.templatesFolder;
  this.scope['pluginsFolder'] = this.pluginsFolder;
  this.scope['controllersFolder'] = this.controllersFolder;
  this.pluginManager = new PluginManager(basePath, this);
  this.pluginManager.loadCommands();
  argsparser.addOptions(this.pluginManager.getLoadedCommands());
  argsparser.parse();
  this.verbose = argsparser.get("verbose");
  Logger.logger.setVerboseEnabled(this.isVerbose());
  if(!this.pluginManager.processAll(argsparser)){
    Logger.log('info', 'Plugin Manager created.');
    this.application = express();
    Logger.log('info', 'Express application instance created.');
    this.controllerManager = new ControllerManager(this, this.controllersFolder)
    Logger.log('info', 'Controller Manager created.');
    this.storage = new Storage(basePath, this.config)
    Logger.log('info', 'Storage created.');
    this.configureApplication();
    this.run = true;
  } else {
    this.run = false;
  }
}

/**
 * Configure the express application
 */
Server.prototype.configureApplication = function Server_configureApplication() {
    this.application.use(bodyParser.urlencoded({ extended: false }));
    this.application.use(bodyParser.json());
    this.application.use(express.static(this.staticsFolder));
    let tagsValue = this.config.tags || {
      blockStart: '{%',
      blockEnd: '%}',
      variableStart: '${',
      variableEnd: '}',
      commentStart: '<!--',
      commentEnd: '-->'
    };
    nunjucks.configure(this.templatesFolder, {
        autoescape: true,
        express: this.application,
        watch: true,
        tags: tagsValue
    });
    this.pluginManager.loadPlugins();
    this.controllerManager.loadControllers();
}

Server.prototype.isVerbose = function Server_isVerbose() {
  return this.verbose;
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
  if (!this.run) {
      return;
  }
  let context = {};
  context.listener = this.listener = this.application.listen(this.config.port, this.onListen.bind(context));
  return this.listener; 
}

/**
 * Get the scope of actions loaded from controllers.
 */
Server.prototype.getScope = function Server_getScope() {
  return this.scope;
}

/**
 * Set the scope of actions loaded from controllers.
 */
Server.prototype.setScope = function Server_setScope(scope) {
    this.scope = scope;
}

/**
 * Set the scope of actions loaded from controllers.
 */
Server.prototype.addToScope = function Server_addToScope(key, value) {
    this.scope[key]=value;
}

module.exports = Server;
