'use strict'

let GulpRoutines = require('./core/gulproutines.js')
  , config = require(__dirname+'/app/config.js')
  , gr = new GulpRoutines(__dirname+'/app', config, true)
  ;

gr.assembleRoutines()

