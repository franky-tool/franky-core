/**
 * @module logger
 */

var fs = require('fs')
  , utils = require('./utils.js')
  , chalk = utils.requireModule('chalk')
  ;

var FILEPATH = "/tmp/franky.log"
    IO = {
      stdout: process.stdout,
      stderr: process.stderr
    }
  ;

/**
 * @class Logger
 * @param defaultlevel {string} Default logging level.
 * @param filepath {filepath} output file path.
 * @param io {Object} io streams.
 */
function Logger (defaultlevel, filepath, io) {
    var self = this;
    this.setIO = function Logger_setIO(io) {
      if(!io) {
        self.io = IO;
      } else {
        IO = self.io = io;
      }
    };
    this.setIO(io);
    
    var FILEPATH = !!filepath ? filepath : undefined
      , defaultlevel = !defaultlevel ? "info" : defaultlevel
      , verboseEnabled
      , defaultlevel = defaultlevel.toLowerCase()
      ;

    this.isVerboseEnabled = function() {
        return verboseEnabled;
    }

    this.setVerboseEnabled = function(val) {
      verboseEnabled = (!!val);
    }

    this.info = function(message) {
        /* istanbul ignore else */
        if(self.isVerboseEnabled()){
            self.getBaseLogger().info(message);
        }
    };
    this.debug = function(message) {
        self.getBaseLogger().debug(message);
    };
    this.error = function(message) {
        /* istanbul ignore else */
        if (typeof(message)=='object' && !!message.stack) {
            message = message.stack;
        };
        self.getBaseLogger().error(message);
    };
    this.warning = function(message) {
        self.getBaseLogger().warning(message);
    };
    this.notice = function(message) {
        self.getBaseLogger().notice(message);
    };
    this.critical = function(message) {
        /* istanbul ignore else */
        if (typeof(message)=='object' && !!message.stack) {
            message = message.stack;
        };
        self.getBaseLogger().critical(message);
    };
    this.success = function(message) {
        self.getBaseLogger().success(message);
    };
    this.log = this["defaultlevel"];
}

/**
  * Write message in io.stdout/io.stderr with specified color.
  * @param color {chalk.color} Message color.
  * @param message {string} specified message.
  * @param critical {boolean} Specify if is critical message. If is critical use io.stdout, otherwise use io.stderr.
  */
Logger.prototype.write = function Logger_write(color, message, critical) {
  var self = this;
  /* istanbul ignore if */
  if(!!message && message.constructor === {}.constructor){
    message = "\n"+JSON.stringify(message, null, 2);
  }
  var out = ""+(new Date())+": "+message+"\n";
  color = color || function(r){return r;};
  outEl = self.io.stdout;
  /* istanbul ignore else */
  if (critical) {
    outEl = self.io.stderr;
  }
  outEl.write(color(out));
}

/**
  * Return the base logger object.
  * @returns {Object} An object with function for every possible log type.
  */
Logger.prototype.getBaseLogger = function Logger_getBaseLogger() {
  var self = this;
  return {
    'info': function(message){
      self.write(chalk.bgBlue, message);
    },
    'debug': function (message){
      self.write(chalk.yellow, message);
    },
    'success': function (message){
      self.write(chalk.green, message);
    },
    'warning': function (message){
      self.write(chalk.magenta, message);
    },
    'notice': function (message){
      self.write(chalk.cyan, message);
    },
    'error': function (message){
      self.write(chalk.red, message, true);
    },
    'critical': function (message){
      self.write(chalk.bgRed, message, true);
    }
  };
};


Logger.logger = new Logger("info");

Logger.log = function (level, message) {
    /* istanbul ignore else */
    if (!message) {
        message = level;
        level = "info";
    };
    var log = Logger.logger[level.toLowerCase()];
    /* istanbul ignore else */
    if (log) {
        log(message);
    };
}

module.exports = Logger;
