'use strict'

let Server = require("./core/server")
  ;

if(require.main === module) {
	let server = new Server([__dirname, 'app'].join('/'))
    ;
	server.start();
} else {
  let utils = require('./core/utils')
    ;
  module.exports = {
    Server: Server,
    getGulpRoutines: function getGulpRoutines(){
      let GulpRoutines = require('./core/gulproutines')
      return GulpRoutines;
    },
    utils: utils
	};
}
