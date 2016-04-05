
var chalk = require('chalk')
  , fs = require('fs')
  ;

var FILEPATH = "/tmp/franky.log"
    IO = {
      stdout: process.stdout,
      stderr: process.stderr
    }
  ;

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

    function write(color, message, critical) {
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

    this.getBaseLogger = function  () {
      return {
        'info': function(message){
          write(chalk.blue, message);
        },
        'debug': function (message){
          write(chalk.yellow, message);
        },
        'success': function (message){
          write(chalk.green, message);
        },
        'warning': function (message){
          write(chalk.orange, message);
        },
        'notice': function (message){
          write(chalk.cyan, message);
        },
        'error': function (message){
          write(chalk.magenta, message, true);
        },
        'critical': function (message){
          write(chalk.red, message, true);
        }
      };
    };

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
