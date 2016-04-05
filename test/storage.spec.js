'use strict'

require('./setup.js');

let Storage = require('../core/storage.js')
  , fs = require('fs')
  , path = require("path")
  ;
  
function rmdir(dir) {
	let list = fs.readdirSync(dir);
	for(let i = 0; i < list.length; i++) {
		let filename = path.join(dir, list[i]);
		let stat = fs.statSync(filename);
		
		if(filename == "." || filename == "..") {
			// pass these files
		} else if(stat.isDirectory()) {
			// rmdir recursively
			rmdir(filename);
		} else {
			// rm fiilename
			fs.unlinkSync(filename);
		}
	}
	fs.rmdirSync(dir);
}


describe('As a developer I want to instantiate an intermediary to save information.\n', function() {
  context('Scenario:\n\tThe storage class exists.', function() {
    let storage
      , config = {
          database: {
            name: __dirname+"/data"
          }
        }
      , collection = 'users'
      , usersData = [
          {_id:1, name:"username 1", password: "userpasswd"}, 
          {_id:2, name:"username 2", password: "userpasswd2"}
        ]
      , user = {
          name: "Third",
          password: "ho ho ho"
        }
      ;
    before(function(){
      //*
      try {
        rmdir(config.database.name);
      } catch (error) {}
      try {
        fs.mkdirSync(config.database.name);
        fs.writeFile(config.database.name+"/"+collection+".json", JSON.stringify(usersData), function(err) {
            if(err) {
                return console.log(err);
            }
        });
      } catch (error) {
        console.error("Error creating file.");
      }
      //*/ 
    });
    beforeEach(function() {
      storage = new Storage(config);
    });
    describe('When the developer instantiate a storage module', function () {
      it('Then will have a method to list the saved information.', function () {
        expect(storage.list).to.exist;
      });
    });
    describe('When the developer use a method list from storage instance', function () {
      it('Then will get a list of saved information.', function (done) {
        storage.list(collection, function storage_list_callback(data) {
          expect(data.length).to.be.equal(2);
          done();
        });
      });
    });
    describe('When the developer use a method list from storage instance with a filter parameter', function () {
      it('Then will get to list of filtered elements from the saved information.', function (done) {
        storage.list(collection, {_id: 2}, function storage_list_callback(data) {
          expect(data.length).to.be.equal(1);
          expect(data[0].name).to.be.equal(usersData[1].name);
          done();
        });
      });
    });
    describe('When the developer use a method list from storage instance using a name into a filter parameter', function () {
      it('Then will get a list of name filtered elements from the saved information.', function (done) {
        storage.list(collection, {name: "username 2"}, function storage_list_callback(data) {
          expect(data.length).to.be.equal(1);
          expect(data[0].password).to.be.equal(usersData[1].password);
          done();
        });
      });
    });
    //
    describe('When the developer instantiate a storage module', function () {
      it('Then will have a method to save information.', function () {
        expect(storage.save).to.exist;
      });
    });
    describe('When the developer the save method from storage instance', function () {
      it('Then will save an element into databse.', function (done) {
        storage.save(collection, user, function storage_save_callback(data) {
          expect(data.name).to.be.equal(user.name);
          expect(data.password).to.be.equal(user.password);
          done();
        });
      });
    });
    describe('When the developer use the save method with a non existing collection', function () {
      it('Then will create a collection and save sent data.', function (done) {
        storage.save(collection+"_save", user, function(data){
          expect(data.name).to.be.equal(user.name);
          expect(data.password).to.be.equal(user.password);
          done();
        });
      });
    });
    describe('When the developer use the save method without saveable object', function () {
      it('Then will launch an exception.', function () {
        try {
          storage.save(collection);
        } catch (error) {
          expect(error.message).to.be.equal('data is not defined.');
        }
      });
    });
    //
    describe('When the developer instantiate a storage module', function () {
      it('Then will have a method to update information.', function () {
        expect(storage.update).to.exist;
      });
    });
    describe('When the developer the update method from storage instance', function () {
      it('Then will update an element into databse.', function (done) {
        let newUser = JSON.parse(JSON.stringify(usersData[0]));
        newUser.name = "Sample User";
        storage.update(collection, usersData[0], newUser, function storage_save_callback(status) {
          expect(status.updated).to.be.equal(1);
          done();
        });
      });
    });
    describe('When the developer use the update method with a non existing collection', function () {
      it('Then will create a collection and save sent data.', function (done) {
        let newUser = JSON.parse(JSON.stringify(usersData[0]));
        newUser.name = "Sample User";
        storage.update(collection+"_update", usersData[0], newUser, {upsert:true}, function(status){
          expect(status.updated).to.be.equal(0);
          expect(status.inserted).to.be.equal(1);
          done();
        });
      });
    });
    describe('When the developer use the save method without filter object', function () {
      it('Then will launch an exception.', function () {
        try {
          storage.update(collection);
        } catch (error) {
          expect(error.message).to.be.equal('filter is not defined.');
        }
      });
    });
    describe('When the developer use the save method without update information object', function () {
      it('Then will launch an exception.', function () {
        try {
          storage.update(collection, {_id:0});
        } catch (error) {
          expect(error.message).to.be.equal('data is not defined.');
        }
      });
    });
    //
    describe('When the developer instantiate a storage module', function () {
      it('Then will have a method to remove information.', function () {
        expect(storage.remove).to.exist;
      });
    });
    describe('When the developer use a method remove from storage instance', function () {
      it('Then will remove all saved information.', function (done) {
        storage.remove(collection, function storage_remove_callback(data) {
          expect(data.length).to.be.equal(0);
          done();
        });
      });
    });
    describe('When the developer use a method remove from storage instance with a filter parameter', function () {
      it('Then will remove a list of filtered elements from the saved information.', function (done) {
        storage.remove(collection, {_id: 2}, function storage_remove_callback(data) {
          expect(data.length).to.be.equal(1);
          done();
        });
      });
    });
    //
  });
});