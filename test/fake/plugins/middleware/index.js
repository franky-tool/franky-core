

function mySuperMiddleware(req, res, next) {
    console.log("Request:",req.method.toUpperCase() + ": " + req.url);
    next();
}


module.exports = {
    "callable": mySuperMiddleware,
    "type": "middleware"
};
