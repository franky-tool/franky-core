'use strict'

let express = require('express')
  ;

function Server(basePath, customConfig) {
    /* istanbul ignore if */
    if(!customConfig){
        customConfig = require(basePath+"/config.js");
    }
    this.basePath = basePath;
    this.application = express();
    this.config = customConfig;
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
    return true;    
}

Server.prototype.start = function Server_start() {
    return this.application.listen(this.config, this.onListen);
}

module.exports = Server;
