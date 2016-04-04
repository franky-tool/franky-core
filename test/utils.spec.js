'use strict'

require('./setup.js');

let utils = require("../core/utils.js")
  ;


describe('As a developer I want to have a set of tools to made more easy develop another components of the system.\n', function() {
  context('Scenario:\n\tThe utils file exists and use node modules standard.', function() {
      describe('Given thath the developer ', function () {
        describe('When the method utils._err is invoqued with a name of parameter', function () {
          it('Then will raise an error with the name and message of error', function () {
            let varName = "sample";
            try {
                utils._err(varName);
            } catch (error) {
                expect(error.message).to.be.equal(varName+" is not defined.");
            }
          });
        });
        describe('When the method utils._err is invoqued with a name of parameter and a custom message', function () {
          it('Then will raise an error with the name and custom error message', function () {
            let varName = "sample"
              , message = "is an invalid field"
              ;
            try {
                utils._err(varName, message);
            } catch (error) {
                expect(error.message).to.be.equal(varName+" "+message);
            }
          });
        });
      });
  });
});

