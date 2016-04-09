'use strict'

let Server = require("./core/server")
  ;

if(require.main === module) {
	let server = new Server([__dirname, 'app'].join('/'));
	server.start();
} else {
  let gulp_routines = require('./core/gulp_routines.js')
    ;
  module.exports = {
		Server: Server,
    gulp_routines: gulp_routines,
    config: config
	};
}
