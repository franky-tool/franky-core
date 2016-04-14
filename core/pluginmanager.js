'use strict'

let utils = require('./utils.js')
  , Logger = require('./logger.js')
  ;

/**
 * Module to manage the plugins of the system.
 */
function PluginManager(basePath, serverInstance){
  if (!basePath) {
    utils._err('basePath');
  }
  if (!serverInstance) {
    utils._err('serverInstance');
  }
  this.serverInstance = serverInstance;
  this.config = this.serverInstance.getConfiguration();
  this.basePath = basePath;
  this.pluginsPath = [this.basePath, this.config.plugins].join(this.config.sep);
  this.commands = [];
  this.processPending = {};
}

/**
 * Use the loaded plugin of middleware type.
 */
PluginManager.prototype.loadMiddlewarePlugin = function PluginManager_loadMiddlewarePlugin(pluginMod) {
  if (pluginMod.type.toLowerCase()!=='middleware') {
    utils._err('plugin.type', "'"+pluginMod.type+"' is invalid plugin type.")
  }
  let server = this.serverInstance
    , action = pluginMod.callable
    ;
  /* istanbul ignore if */
  if (!!pluginMod.bind) {
    action = action.bind(this.serverInstance.getScope());
  }
  server.getApplication().use(action);
}

/**
 * Process all command plugins.
 */
PluginManager.prototype.processAll = function PluginManager_processAll(argsparser) {
  let retValue = false;
  for(let key in this.processPending){
    let element = this.processPending[key]
      , argValue = argsparser.get(key)
      ;
    /* istanbul ignore else */
    if (!!element.callable && argValue) {
      retValue = !!element.options.exit;
      let action = element.callable;
      /* istanbul ignore else */
      if (element.bind) {
        action = action.bind(this.serverInstance.getScope());
      }
      if (!!element.options.execute) {
        if(element.callable.length==1){
          action(argValue);
        } else {
          action();
        }
      } else {
        /* istanbul ignore else */
        if(!!element.options.include){
          this.serverInstance.addToScope(key, action);
        }
      }
    }
  }
  return retValue;
}

/**
 * Return loaded command plugins
 */
PluginManager.prototype.getLoadedCommands = function PluginManager_getLoadedCommands(pluginMod) {
  return this.commands;
}

PluginManager.prototype.loadCommandlinePlugin = function PluginManager_loadCommandlinePlugin(pluginMod) {
  /* istanbul ignore if */
  if (pluginMod.type.toLowerCase()!=='commandline') {
    utils._err('plugin.type', "'"+pluginMod.type+"' is invalid plugin type.")
  }
  let cmd = []
    ;
  /* istanbul ignore else */
  if(!!pluginMod.command.value){
    /* istanbul ignore else */
    if(pluginMod.command.value.indexOf('--')>0){
      let plgName = pluginMod.command.value.split('--')[1].split(' ')[0]; 
      this.processPending[plgName] = pluginMod;
    }
    cmd.push(pluginMod.command.value);
    /* istanbul ignore else */
    if(!!pluginMod.command.help){
      cmd.push(pluginMod.command.help);
    }
    /* istanbul ignore else */
    if(!!pluginMod.command.preprocessor){
      cmd.push(pluginMod.command.preprocessor);
    }
    this.commands.push(cmd);
  }
} 

/**
 * Load a command plugin acording the name.
 */
PluginManager.prototype.loadCommand = function PluginManager_loadCommand(pluginName) {
  /* istanbul ignore if */
  if (!pluginName) {
    utils._err('pluginName');
  }
  let modpath = [this.pluginsPath, pluginName].join(this.config.sep)
    , pluginMod = utils.requireModule(modpath)
    ;
  switch (pluginMod.type.toLowerCase()) {
    case 'commandline':
      Logger.log('info', "\t* Loading "+pluginName+" as "+pluginMod.type.toLowerCase());
      this.loadCommandlinePlugin(pluginMod);
      break;
  }
}

/**
 * Load a plugin acording the name.
 */
PluginManager.prototype.loadPlugin = function PluginManager_loadPlugin(pluginName) {
  if (!pluginName) {
    utils._err('pluginName');
  }
  let modpath = [this.pluginsPath, pluginName].join(this.config.sep)
    , pluginMod = utils.requireModule(modpath)
    ;
  switch (pluginMod.type.toLowerCase()) {
    case 'middleware':
      Logger.log('info', "\t* Loading "+pluginName+" as "+pluginMod.type.toLowerCase());
      this.loadMiddlewarePlugin(pluginMod);
      break;
  }
}

/**
 * Load all command plugins.
 */
PluginManager.prototype.loadCommands = function PluginManager_loadCommands() {
  let modpath = [this.pluginsPath].join(this.config.sep)
    , filesList = utils.ls(modpath);
    ;
  for(let p in filesList){
    this.loadCommand(filesList[p]);
  }
}

/**
 * Load plugins.
 */
PluginManager.prototype.loadPlugins = function PluginManager_loadPlugins() {
  let modpath = [this.pluginsPath].join(this.config.sep)
    , filesList = utils.ls(modpath);
    ;
  for(let p in filesList){
    /* istanbul ignore else */
    if(filesList[p].indexOf('.')!==0){
      this.loadPlugin(filesList[p]); 
    }
  }
}

module.exports = PluginManager;
