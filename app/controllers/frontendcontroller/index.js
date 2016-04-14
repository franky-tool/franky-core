'use strict'

let fs = require('fs')
  ;

let getRoot = function getRoot(req, res) {
    let config = this.config
      , templates = this.templatesFolder
      ;
    let tplName = req.params.url;
    if(!tplName){
        tplName = "index.html";
    }
    let tplsPath = [templates, tplName].join("/");
    fs.lstat(tplsPath, (err)=>{
        if(err){
            return res.status(404).send("<h1>404 - Not Found</h1>Requested path not found.");
        }
        res.render(tplName, {title: "Hello"});
    });
};


let paths = {
    '/': {
        "get": getRoot
    }
}


module.exports = paths;

