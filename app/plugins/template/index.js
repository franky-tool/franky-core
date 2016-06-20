'use strict'

/*

let Logger
  , utils
  , nunjucks = require('nunjucks')
  ;

let njksEnv;

function processTemplateEngine(server){
    Logger = this.Logger;
    utils = this.utils;
    let tagValues = server.config.tags || {
      blockStart: '{%',
      blockEnd: '%}',
      variableStart: '${',
      variableEnd: '}$',
      commentStart: '<!--',
      commentEnd: '-->'
    };
    let data = {
        autoescape: true,
        express: server.application,
        watch: true,
        tags: tagValues
    };
    njksEnv = nunjucks.configure(server.templatesFolders, data);
}

function loadTemplateEngineFilters(server) {
  let filters = server.pluginManager.getLoadedFilters()
    , action
    ;
  for(let key in filters){
    action = filters[key].bind(server.scope)();
    Logger.log('info', '\t\t- '+key);
    njksEnv.addFilter(key, action);
  }
}

module.exports = {
    "type": "templateEngine",
    "templateEngineProcessor": processTemplateEngine,
    "loadTemplateEngineFilters": loadTemplateEngineFilters 
}

*/


let exphbs  = require('express-handlebars')
  ;

function processTemplateEngine(server) {
  let app = server.application
    , templatesFolder = server.templatesFolders[0]
    ;

  let hbs = exphbs.create({
    defaultLayout:'main', 
    extname:'.hbs', 
    layoutsDir: templatesFolder
  });
  app.engine('hbs', hbs.engine);
  app.set('view engine', 'hbs');
  app.set('views', templatesFolder);

}

function loadTemplateEngineFilters(server) {
  
}

module.exports = {
    "type": "templateEngine",
    "templateEngineProcessor": processTemplateEngine,
    "loadTemplateEngineFilters": loadTemplateEngineFilters 
}
