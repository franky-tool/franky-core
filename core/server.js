/**
 * @module server
 */

'use strict'

let Logger = require('./logger')
  , utils = require('./utils.js')
  , Storage = require('./storage.js')
  , ArgsParser = require("./argsparser.js")
  , PluginManager = require('./pluginmanager')
  , ControllerManager = require('./controllermanager')
  , express = utils.requireModule('express')
  , bodyParser = utils.requireModule('body-parser')
  , nunjucks = utils.requireModule('nunjucks')
  , clr = utils.requireModule('connect-livereload')
  ;

/**
 * @class
 * @param basePath {string} root path for search all controllers.
 * @param verbose {boolean} Set verbose outputs enabled.
 * @param customConfig {Object} Custom configuration.
 */
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
    "Logger": Logger,
    "basePath": basePath
  };
  this.verbose = (process.argv.indexOf('-v')>=0||process.argv.indexOf('--verbose')>=0) || !!verbose;
  /* istanbul ignore if */
  if(!customConfig){
      customConfig = require(basePath+"/config.js");
  }
  Logger.logger.setVerboseEnabled(this.isVerbose());
  this.basePath = basePath;
  this.config = customConfig;
  if((typeof this.config.templates)==='string'){
    this.config.templates = [this.config.templates];
  }
  Logger.log('info', "Base path: "+this.basePath);
  this.sourcesFolder = [basePath, this.config.sources].join(this.config.sep)
  Logger.log('info', "Sources path: "+this.sourcesFolder);
  this.staticsFolder = [basePath, this.config.statics].join(this.config.sep)
  Logger.log('info', "Statics path: "+this.staticsFolder);
  this.templatesFolders = this.config.templates.reduce(function(acc, current){
    if(current.indexOf('/')==0){
      acc.push(current);
    } else {
      acc.push([basePath, current].join(self.config.sep));
    }
    return acc;
  },[]);
  this.application = express();
  Logger.log('info', 'Express application instance created.');
  this.scope["application"] = this.application;
  Logger.log('info', "Templates path: "+this.templatesFolders);
  this.pluginsFolder = [basePath, this.config.plugins].join(this.config.sep)
  Logger.log('info', "Plugins path: "+this.pluginsFolder);
  this.controllersFolder = [basePath, this.config.controllers].join(this.config.sep)
  Logger.log('info', "Controllers path: "+this.controllersFolder);
  this.scope['sourcesFolder'] = this.sourcesFolder;
  this.scope['staticsFolder'] = this.staticsFolder;
  this.scope['templatesFolders'] = this.templatesFolders;
  this.scope['pluginsFolder'] = this.pluginsFolder;
  this.scope['controllersFolder'] = this.controllersFolder;
  this.scope['config'] = this.config;
  this.pluginManager = new PluginManager(basePath, this);
  this.pluginManager.loadCommands();
  argsparser.addOptions(this.pluginManager.getLoadedCommands(), this.scope);
  argsparser.parse();
  this.verbose = argsparser.get("verbose");
  Logger.logger.setVerboseEnabled(this.isVerbose());
  if(!this.pluginManager.processAll(argsparser)){
    Logger.log('info', 'Plugin Manager created.');
    this.controllerManager = new ControllerManager(this, this.controllersFolder)
    Logger.log('info', 'Controller Manager created.');
    this.storage = new Storage(basePath, this.config);
    this.scope['storage'] = this.storage;
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
    this.pluginManager.loadTemplateEngines();
    if(this.config.autoreload === 'liveserver'){
      this.application.use(clr());
    }
    this.pluginManager.loadPlugins();
    this.controllerManager.loadControllers();
}

/**
 * @returns {boolean} True if verbosity is enabled, otherwise false.
 */
Server.prototype.isVerbose = function Server_isVerbose() {
  return this.verbose;
}

/**
 * Set server configuration.
 * @param config {Object} New configuration.
 */
Server.prototype.setConfiguration = function Server_setConfiguration(config) {
  this.config = config;
}

/**
 * @returns {Object} A configuration object.
 */
Server.prototype.getConfiguration = function Server_getConfiguration() {
  return this.config;
}

/**
 * @returns {Express.Application} the saved express aplication instance.
 */
Server.prototype.getApplication = function Server_getApplication() {
  return this.application;
}

/**
 * @returns {string} The stored root path.
 */
Server.prototype.getBasePath = function Server_getBasePath() {
  return this.basePath;
}
/**
 * Method executed where server is ready.
 */
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
/**
 * Starts the web server.
 * @returns {http.Server} The server instance created.
 */
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
 * @returns {Object} The aplication sope object.
 */
Server.prototype.getScope = function Server_getScope() {
  return this.scope;
}

/**
 * Set the plugins' methods scope.
 * @param scope {Object} new application scope.
 */
Server.prototype.setScope = function Server_setScope(scope) {
    this.scope = scope;
}

/**
 * Add new element to the plugins' methods scope.
 * @param key {string} Element name in scope
 * @param value {Object} Element value
 */
Server.prototype.addToScope = function Server_addToScope(key, value) {
    this.scope[key]=value;
}

module.exports = Server;
