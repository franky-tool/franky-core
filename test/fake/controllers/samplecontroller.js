'use strict'


let paths = {
    '/': {
        'get': function sampleGetAction(req, res) {
            res.send("OK");
        }
    }
}


module.exports = paths;
