'use strict'

let fs = require('fs')
  ;

let getRoot = function getRoot(req, res) {
    let config = this.config
      ;
    let tplName = req.params.url;
    if(!tplName){
        tplName = "index.html";
    }
    res.render(tplName, {title: "Hello"}, function renderTemplate(err, html) {
        if (err) {
            Logger.log('critical','Rendering error:'+err.message);
            return res.status(404).send("<h1>404 - Not Found</h1>Requested path not found.");
        }
        res.send(html);
    });
};


let paths = {
    '/:url([a-z]*)?': {
        "get": getRoot
    }
}


module.exports = paths;

