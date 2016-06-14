/**
 * Assertion and testing utilities
 */
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

global.AssertionError = chai.AssertionError;
global.expect = chai.expect;

