'use strict'

require('./setup.js');

let utils = require("../core/utils.js")
  ;


describe('As a developer I want to have a set of tools to made more easy develop another components of the system.\n', function() {
  context('Scenario:\n\tThe utils file exists and use node modules standard.', function() {
      describe('Given that the developer import the utils module', function () {
        describe('When the method utils._err is invoked with a name of parameter', function () {
          it('Then will raise an error with the name and message of error', function () {
            let varName = "sample";
            try {
                utils._err(varName);
            } catch (error) {
                expect(error.message).to.be.equal(varName+" is not defined.");
            }
          });
        });
        describe('When the method utils._err is invoked with a name of parameter and a custom message', function () {
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
        describe('When the method utils.folderExists is invoked with the parameter "unexistent"', function () {
          it('Then return false', function () {
            let path = __dirname+'/unexistent';
            expect(utils.folderExists(path)).to.be.false;
          });
        });
        describe('When the method utils.folderExists is invoked with the parameter "fake"', function () {
          it('Then return false', function () {
            let path = __dirname+'/fake';
            expect(utils.folderExists(path)).to.be.true;
          });
        });
        describe('When the method utils.getFileList is invoked with parameter "/unexistent"', function () {
          it('Then return an void array.', function () {
            let path = __dirname+'/unexistent';
            expect(utils.getFilesList(path).length).to.be.equal(0);
          });
        });
        describe('When the method utils.getFileList is invoked with parameter "/fake"', function () {
          it('Then return ["controllers"]', function () {
            let path = __dirname+'/fake';
            expect(utils.getFilesList(path)[0]).to.be.equal('badcontrollers');
            expect(utils.getFilesList(path)[1]).to.be.equal('controllers');
          });
        });
        describe('When the method utils.fileExists is invoked with parameter "/fake/controllers"', function () {
          it('Then return false', function () {
            let path = __dirname+'/unexistent';
            expect(utils.fileExists(path)).to.be.false;
          });
        });
        describe('When the method utils.fileExists is invoked with parameter "/fake/controllers/samplecontroller.js"', function () {
          it('Then return true', function () {
            let path = __dirname+'/fake/controllers/samplecontroller.js';
            expect(utils.fileExists(path)).to.be.true;
          });
        });
      });
  });
});

