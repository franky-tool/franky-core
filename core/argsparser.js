/**
 * @module argsparser
 */

'use strict'

let utils = require('./utils.js')
  , program = utils.requireModule('commander')
  ;


/**
 * @class
 * Parse the arguments passed from command line.
 */
function ArgsParser() {
  this.program = program;
  this.program
    .version('0.0.1')
    .option('-v, --verbose', 'Show verbose output')
  ;
}

/**
 * Agregate an option to command line parser.
 */
ArgsParser.prototype.addOption = function ArgsParser_addOption(option) {
  this.program.option.apply(this.program, option);
}

/**
 * Agregate many options to command line parser.
 */
ArgsParser.prototype.addOptions = function ArgsParser_addOptions(options, context) {
  for (let index = 0; index < options.length; index++) {
    let element = options[index];
    if (!!context && (typeof(element[element.length-1])==='function')) {
      element[element.length-1] = element[element.length-1].bind(context);
    }
    this.addOption(element);
  }
}

/**
 * Get a value passed from command line.
 */
ArgsParser.prototype.get = function ArgsParser_get(key){
  return this.program[key];
}

/**
 * Start arguments parse process.
 */
ArgsParser.prototype.parse = function ArgsParser_parse() {
  this.program.parse(process.argv);
  return this;
}
   
module.exports = ArgsParser;
