'use strict'

let utils = require('./utils.js')
  , program = utils.requireModule('commander')
  ;

/**
 * Parse the arguments passed from command line.
 */
function ArgsParser() {
  this.program = program;
  this.program
    .version('0.0.1')
    .option('-g, --generate', 'Generate static site')
    .option('-v, --verbose', 'Show verbose output')
    .option('-f, --flag-server', 'Flag for server recognition')
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
ArgsParser.prototype.addOptions = function ArgsParser_addOptions(options) {
  for (let index = 0; index < options.length; index++) {
    let element = options[index];
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
