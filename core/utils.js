'use strict'

let fs = require('fs')
  , mkdirp = require('mkdirp')
  , path = require('path')
  ;

/**
 * Able the developer to launch an exception of type.
 */
function _err(paramname, complement) {
  complement = complement || 'is not defined.';
  try{
    throw new Error(paramname+' '+complement);
  } catch(error){
    let stacktrace = error.stack.split('\n');
    stacktrace.splice(1, 1);
    let err = new Error(paramname+' '+complement);
    err.stack = stacktrace.join('\n')
    throw err;
  }
}

/**
 * Return true if folder exists, else false.
 */
function folderExists(fp) {
  try{
    let stats = fs.lstatSync(fp);
    /* istanbul ignore else */
    if (stats.isDirectory()) {
      return true;
    }
  } catch(err){
    return false;
  }
}

/**
 * Return true if file exists, else false.
 */
function fileExists(fp) {
  try{
    let stats = fs.lstatSync(fp);
    /* istanbul ignore else */
    if (stats.isFile()) {
      return true;
    }
  } catch(err){
    return false;
  }
}

/**
 * Check if file or folder from specified path exists.
 */
function exists(fpath) {
    return (folderExists(fpath)||fileExists(fpath));
}

/**
 * Return the list of files stored in specified folder.
 */
function getFilesList(fp) {
  if(folderExists(fp)){
    return fs.readdirSync(fp);
  } else {
    return [];
  }
}
/**
 * Return the list of folders stored in specified folder.
 */
function getFoldersList(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

/**
 * List all files from a specified path.
 */
function ls(target) {
    return getFilesList(target).reduce(function(array, item){
        if(array.indexOf(item)<0){
            array.push(item);
        }
        return array;
    }, 
    getFoldersList(target)
    );
}

/* istanbul ignore next */
/**
 * Return a required module.
 */
function requireModule(path) {
  return require(path);
}

/**
 * Make a dir from specified path.
 */
function mkdir(path) {
  mkdirp(path);
}

/**
 * Check if express request is for JSON data.
 */
function isJSONRequest(req) {
  return (/application\/json/.test(req.get('content-type').toLowerCase()));
}


module.exports = {
    _err: _err,
    folderExists: folderExists,
    fileExists: fileExists,
    getFilesList: getFilesList,
    getFoldersList: getFoldersList,
    exists: exists,
    ls: ls,
    requireModule: requireModule,
    mkdir: mkdir,
    isJSONRequest: isJSONRequest
}
