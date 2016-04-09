'use strict'

let fs = require('fs')
  , mkdirp = require('mkdirp')
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
 * Return the list of files stored in specified folder.
 */
function getFilesList(fp) {
  if(folderExists(fp)){
    return fs.readdirSync(fp);
  } else {
    return [];
  }
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

module.exports = {
    _err: _err,
    folderExists: folderExists,
    fileExists: fileExists,
    getFilesList: getFilesList,
    requireModule: requireModule,
    mkdir: mkdir
}
