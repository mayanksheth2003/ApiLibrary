var jwt = require("jwt-simple");
var validateApiKey = require("../api/accountApi.js").validateApiKey;

module.exports = function (req, res, next) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers["x-access-token"];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.header["x-key"];

    if (token || key) {
        try {
            var decoded = jwt.decode(token, require("../config/secret.js")());
            
            if (decoded.exp <= Date.now()) {
                res.status(400);
                res.json({
                    "status": 400,
                    "message": "Token expired"
                });
                return;
            }
            
            var user = decoded.user ? decoded.user : key;
            validateApiKey(user)
            .then(function (result) {
                if (result) {
                    if ((req.originalUrl.indexOf('/u') >= 0 && result == '2') || (req.originalUrl.indexOf('/c') >= 0 && result == '1') || (req.originalUrl.indexOf('/a') >= 0 && result == '0')) {
                        next();
                    } else {
                        res.status(403);
                        res.json({
                            "status" : 403,
                            "message" : "Not authrized"
                        });
                        return;
                    }
                }
            })
            .fail(function (err) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid User"
                });
            })
            .done();
            /*if (dbUser) {
                //if ((req.url.indexOf("admin") >= 0 && dbUser.role == "admin") || (req.url.indexOf("admin") <= 0 && req.url.indexOf("/api/") >= 0)) {
                //    next();
                //} else {
                //    res.status(403);
                //    res.json({
                //        "status": 403,
                //        "message": "Not Authorized"
                //    });
                //    return;
                //}
                next();
            } else {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid User"
                });
                return;
            }*/
        } catch (err) {
            res.status(500);
            res.json({
                "status": 500,
                "message": "Oops! Something went wrong!",
                "error": err
            });
        }
    } else {
        res.status(401);
        res.json({
            "status": 401,
            "message": "Invalid Token or key"
        });
        return;
    }
};