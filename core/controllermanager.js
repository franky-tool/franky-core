'use strict'

let utils = require('./utils.js')
  , Logger = require('./logger.js')
  ;

function ControllerManager(server, basePath){
  if (!server) {
    utils._err('server');
  }
  if (!basePath) {
    utils._err('basePath');
  }
  if (!server.getApplication()) {
    utils._err('server', 'The provided server is not a valid server instance.');
  }
  this.server = server;
  this.basePath = basePath;
}

/**
 * This method load a controller file from specified path.
 */
ControllerManager.prototype.loadControllerFile = function ControllerManager_loadControllerFile(modulePath){
  let returnValue = [];
  try {
    /* istanbul ignore else */
    if(utils.fileExists(modulePath)){
      Logger.log('info', 'Importing '+modulePath);
      return utils.requireModule(modulePath)
        ;
    }
  } catch (error) {
    Logger.log('critical', 'Invalid module '+modulePath+": "+error.message);
  }
  return null;
};

/**
 * This method load the controllers from base path.
 */
ControllerManager.prototype.loadControllers = function ControllerManager_loadControllers() {
  let files = utils.getFilesList(this.basePath);
  for(let idx in files){
    let el = files[idx]
      , moduleContent = this.loadControllerFile(this.basePath+"/"+el)
      ;
    this.injectModule(moduleContent);
  }
};

/**
 * This method inject a group of paths and actions into an express aplication instance. 
 */
ControllerManager.prototype.injectModule = function ControllerManager_injectModule(moduleContent) {
  for(let path in moduleContent){
    for(let method in moduleContent[path]){
      let action = moduleContent[path][method];
      this.server.getApplication()[method.toLocaleLowerCase()](path, action);
    }
  }
}

module.exports = ControllerManager;