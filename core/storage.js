'use strict'

let diskdb = require('diskdb')
  , utils = require('./utils.js')
  ;

function Storage(config) {
    this.config = config;
    this.db = diskdb.connect(this.config.database.name);
}

/**
 * List elements from specified collection
 */
Storage.prototype.list = function Storage_get(collection, filter, cb) {
    if(!cb){
      cb = filter;
      filter = undefined;
    }
    if(!this.db[collection]){
      this.db.loadCollections([collection]);
    }
    let result = this.db[collection].find(filter);
    /* istanbul ignore else */
    if(!!cb){
      cb(result)
    }
}

/**
 * Save elements into specific collection
 */
Storage.prototype.save = function Storage_save(collection, data, cb) {
    /* istanbul ignore else */
    if(!data){
      utils._err("data");
    }
    if(!this.db[collection]){
      this.db.loadCollections([collection]);
    }
    let result = this.db[collection].save(data);
    /* istanbul ignore else */
    if(!!cb){
      cb(result)
    }
}

/**
 * Update elements into specific collection
 */
Storage.prototype.update = function Storage_update(collection, filter, data, options, cb) {
    /* istanbul ignore else */
    if(!cb){
      cb = options;
      options = {
        multi: false, // update multiple - default false 
        upsert: false // if object is not found, add it (update-insert) - default false 
      };
    }
    /* istanbul ignore else */
    if(!filter){
      utils._err("filter");
    }
    /* istanbul ignore else */
    if(!data){
      utils._err("data");
    }
    if(!this.db[collection]){
      this.db.loadCollections([collection]);
    }
    let result = this.db[collection].update(filter, data, options);
    /* istanbul ignore else */
    if(!!cb){
      cb(result)
    }
}

/**
 * Remove elements from specified collection
 */
Storage.prototype.remove = function Storage_remove(collection, filter, cb) {
    if(!cb){
      cb = filter;
      filter = undefined;
    }
    if(!this.db[collection]){
      this.db.loadCollections([collection]);
    }
    let result = this.db[collection].find(filter);
    /* istanbul ignore else */
    if(!!cb){
      cb(result)
    }
}


module.exports = Storage;
