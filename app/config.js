
var config = {
    "port": 9090,
    "sources":"src",
    "statics": "public",
    "plugins": "plugins",
    "templates": ["templates"],
    "controllers": "controllers",
    "database": {
        name: "data"
    },
    "sep": "/",
    "ignore_prefix": "__",
    "preprocessor": "sass"
}

module.exports = config;
