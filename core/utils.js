/**
 * @module utils
 */

'use strict'

let fs = require('fs')
  , path = require('path')
  , mkdirp = requireModule('mkdirp')
  ;

/**
 * Able the developer to launch an invalid type exception.
 * @param paramname {string} Name from invalid argument.
 * @param complement {string} Complememtary exception message.
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
 * @param fp {string} Folder path.
 * @returns {boolean} Return true if is valid path, otherwise false.
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
 * @param fp {string} File path.
 * @returns {boolean} Return true if is valid file, otherwise false.
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
 * @param fpath {string} Target path.
 * @returns {boolean} Return true if is valid file or folder, otherwise false.
 */
function exists(fpath) {
    return (folderExists(fpath)||fileExists(fpath));
}

/**
 * Return the list of files stored in specified folder.
 * @param fp {string} Folder path.
 * @returns {string[]} list elements in specified folder and return an array with element names.
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
 * @param srcpath {string} Folder path.
 * @returns {string[]} list folders in specified folder and return an array with the names.
 */
function getFoldersList(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

/**
 * List all files from a specified path.
 * @param target {string} Folder path.
 * @returns {string[]} list elements in specified folder and return an array with element names.
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
 * @param path {string} Module path or name.
 * @returns {Module} Specified module.
 */
function requireModule(path) {
  if(global.__libraries==undefined){
    global.__libraries = {};
  }
  if(!global.__libraries[path]){
    global.__libraries[path] = require(path);
  }
  return global.__libraries[path];
}

/* istanbul ignore next */
/**
 * Make a dir from specified path.
 * @param path {string} Target folder path.
 */
function mkdir(path) {
  mkdirp(path);
}

/**
 * Check if express request is for JSON data.
 * @param req {Express.Request} Express request object.
 * @returns {boolean} True if is a valid json request, otherwise false.
 */
function isJSONRequest(req) {
  return (/application\/json/.test(req.get('content-type').toLowerCase()));
}


/**
 * Get the content from JSON file.
 * @param filepath {string} JSON file path.
 * @param verbose {boolean} Log errors.
 * @returns {Object|null} JSON file content or null if fail loading it.
 */
function getJSON(filepath, verbose) {
  let obj;
  try {
    obj = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (error) {
    verbose&&console.error(error);
    obj = null;
  }
  return obj;
}

/**
 * Execute command as a subproces and return it.
 * @param command {string} Command to execute.
 * @param args {string[]} Arguments from command.
 * @param stdout {function} Function to catch stdout messages.
 * @param stderr {function} Function to catch stderr messages.
 * @param onexit {function} Function to execute when subprocess is finished.
 * @returns {ChildProcess} Create subprocess from command and argument values and return it.
 */
function launchProcess(command, args, stdout, stderr, onexit) {
  if(!command){
    return;
  }
  if(!args){
    args = [];
  }
  if(!stdout){
    stdout = function(data){
      process.stdout.write(''+data);
    };
  }
  if(!stderr){
    stderr = function(data){
      process.stderr.write(''+data);
    };
  }
  if(!onexit){
    onexit = function(code){
      console.log('child process exited with code '+code);
    };
  }
  let sp = spawn(command, args);
  sp.stdout.on('data', stdout);
  sp.stderr.on('data', stderr);
  sp.on('close', onexit);
  return sp;
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
    isJSONRequest: isJSONRequest,
    getJSON: getJSON,
    launchProcess: launchProcess
}
