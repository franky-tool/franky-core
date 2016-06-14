
var config = {
    "port": 9091,
    "sources":"src",
    "statics": "public",
    "plugins": "plugins",
    "generationPort": 6783,
    "templates": ["templates"],
    "generationFolder": "_site",
    "controllers": "controllers",
    "database": {
        name: "data"
    },
    "sep": "/",
    "ignore_prefix": "__",
    "preprocessor": "sass"
}

module.exports = config;
