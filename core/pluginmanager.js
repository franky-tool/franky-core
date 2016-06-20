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
  this.filters = {};
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
    } else if(!element.callable && argValue){
      Logger.log('critical', 'No action for parameter "'+key+'".');
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

/**
 * Return loaded filter plugins
 */
PluginManager.prototype.getLoadedFilters = function PluginManager_getLoadedFilters(pluginMod) {
  return this.filters;
}

/**
 * Load plugin that provide an extra filters for templates.
 */
PluginManager.prototype.loadFilterPlugins = function PluginManager_loadFilterPlugins(pluginMod) {
  let modpath = [this.pluginsPath].join(this.config.sep)
    , filesList = utils.ls(modpath);
    ;
  for(let p in filesList){
    this.loadFilter(filesList[p]);
  }
}

/**
 * Load a command filter plugin acording the name.
 */
PluginManager.prototype.loadFilter = function PluginManager_loadFilter(pluginName) {
  /* istanbul ignore if */
  if (!pluginName) {
    utils._err('pluginName');
  }
  let modpath = [this.pluginsPath, pluginName].join(this.config.sep)
    , pluginMod = utils.requireModule(modpath)
    ;
  if (pluginMod.type.toLowerCase()==='filter') {
    Logger.log('info', "\t* Loading "+pluginName+" as "+pluginMod.type.toLowerCase());
    this.loadFilterPlugin(pluginMod);
  }
}

/**
 * Load plugin that provide a template filter functionality.
 */
PluginManager.prototype.loadFilterPlugin = function PluginManager_loadFilterPlugin(pluginMod) {
  /* istanbul ignore if */
  if (pluginMod.type.toLowerCase()!=='filter') {
    utils._err('plugin.type', "'"+pluginMod.type+"' is invalid plugin type.")
  }
  for(let key in pluginMod.filters){
    if(this.filters[key]==undefined){
      this.filters[key] = pluginMod.filters[key]
    } else {
      Logger.log('error', "Filter name "+key+" has already taken.");
    }
  }
} 

PluginManager.prototype.loadSingleCommand = function PluginManager_loadSingleCommand(command) {
  let cmd = []
    ;
  /* istanbul ignore else */
  if(!!command.value){
    /* istanbul ignore else */
    if(command.value.indexOf('--')>0){
      let plgName = command.value.split('--')[1].split(' ')[0];
      plgName = plgName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); }); 
      this.processPending[plgName] = command;
      // TODO:
    }
    cmd.push(command.value);
    /* istanbul ignore else */
    if(!!command.help){
      cmd.push(command.help);
    }
    /* istanbul ignore else */
    if(!!command.preprocessor){
      cmd.push(command.preprocessor);
    }
    this.commands.push(cmd);
  }
}

/**
 * Load plugin that provide a command line functionality.
 */
PluginManager.prototype.loadCommandlinePlugin = function PluginManager_loadCommandlinePlugin(pluginMod, pluginName) {
  /* istanbul ignore if */
  if (pluginMod.type.toLowerCase()!=='commandline') {
    utils._err('plugin.type', "'"+pluginMod.type+"' is invalid plugin type.")
  }  
  if(!!(pluginMod.commands)){
    let command;
    for(let commandIndex=0; commandIndex<pluginMod.commands.length; commandIndex++){
      command = pluginMod.commands[commandIndex];
      this.loadSingleCommand(command)
    }
  } else if(!!pluginMod.command){
    Logger.log('critical', 'Plugin "'+pluginName+'" contract is too old.');
    process.exit(-1);
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
  if (!!pluginMod.type && pluginMod.type.toLowerCase()==='commandline') {
    Logger.log('info', "\t* Loading "+pluginName+" as "+pluginMod.type.toLowerCase());
    this.loadCommandlinePlugin(pluginMod, pluginName);
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
  if (pluginMod.type.toLowerCase()==='middleware') {
    Logger.log('info', "\t* Loading "+pluginName+" as "+pluginMod.type.toLowerCase());
    this.loadMiddlewarePlugin(pluginMod);
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

/**
 * Load template engine routines
 */
PluginManager.prototype.loadTemplateEnginePlugin = function PluginManager_loadTemplateEnginePlugin(pluginMod, pluginName) {
  pluginMod.templateEngineProcessor.bind(this.serverInstance.getScope())(this.serverInstance);
  this.loadFilterPlugins();
  this.serverInstance.addToScope("templateEngine", {
    nameProprocessor: pluginMod.templateNameProprocessor||function(n){ return n; }
  });
  pluginMod.loadTemplateEngineFilters.bind(this.serverInstance.getScope())(this.serverInstance);
}

/**
 * Load template engine acording the name.
 */
PluginManager.prototype.loadTemplateEngine = function PluginManager_loadTemplateEngine(pluginName) {
  if (!pluginName) {
    utils._err('templateEngine');
  }
  let modpath = [this.pluginsPath, pluginName].join(this.config.sep)
    , pluginMod = utils.requireModule(modpath)
    ;
  if (pluginMod.type.toLowerCase()==='templateengine') {
    Logger.log('info', "\t* Loading "+pluginName+" as "+pluginMod.type.toLowerCase());
    this.loadTemplateEnginePlugin(pluginMod, pluginName);
  }
}

/**
 * Load template engines.
 */
PluginManager.prototype.loadTemplateEngines = function PluginManager_loadTemplateEngines() {
  let modpath = [this.pluginsPath].join(this.config.sep)
    , filesList = utils.ls(modpath);
    ;
  for(let p in filesList){
    /* istanbul ignore else */
    if(filesList[p].indexOf('.')!==0){
      this.loadTemplateEngine(filesList[p]); 
    }
  }
}

module.exports = PluginManager;
