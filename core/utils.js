'use strict'

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

module.exports = {
    _err: _err
}
