

function logAccess(req, res, next) {
  this.Logger.log("debug", new Date(), req.method, req.url);
  next();
}


module.exports = {
    "callable": logAccess,
    "type": "middleware",
    "bind": true
};

