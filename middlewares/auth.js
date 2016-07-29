var jwt = require("jwt-simple");
var bcrypt = require("bcryptjs");
var mysql = require('mysql');
var baseAuth = require('basic-auth');
var Q = require('q');
var salt = bcrypt.genSaltSync(10);

var pool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "",
    database: "test"
});

var auth = {
    login: function (req, res) {
        var creds = baseAuth(req);
        if (!creds || !creds.name || !creds.pass) {
            res.status(401);
            res.json({
                "status": 401,
                "message": "No credentials supplied"
            });
        } else {
            var username = creds.name;
            var password = creds.pass;
            
            auth.validateUser(username, password)
            .then(function (result) {
                if (result) {
                    res.json(genToken(result));
                }
            })
            .fail(function (err) {
                res.status(401);
                res.json({
                    "status": 401,
                    "message": "Invalid credentials."
                });
            })
            .done();
        }
    },
    
    validate: function (username) {
        var deferred = Q.defer();
        if (username) {
            pool.getConnection(function (err, conn) {
                conn.query('SELECT id from user WHERE username = ?', [username], function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    }
                    deferred.resolve(results[0].id);
                });
                conn.release();
            });
        }
        return deferred.promise;
    },
    
    validateUser: function (username, password) {
        var deferred = Q.defer();
        if (username && password) {
            pool.getConnection(function (err, conn) {
                conn.query('SELECT * FROM user WHERE username = ?', [username], function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    } else if (results) {
                        if (bcrypt.compareSync(password, results[0].password)) {
                            deferred.resolve(results[0].username);
                        }
                    }
                });
                conn.release();
            });
        }
        return deferred.promise;
    },
    
    register: function (req, res) {
        if (req.body.username && req.body.password) {
            var hash = bcrypt.hashSync(req.body.password);

            pool.getConnection(function (err, conn) {
                conn.query('INSERT INTO user(username, password, created) VALUES(?, ?, CURDATE())', [req.body.username, hash], function (err, results) {
                    if (err) {
                        console.log('Error creating user: %s', err);
                    }
                    res.json({ message: "User created." });
                });
                conn.release();
            });
        } else {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }
    }
}

function genToken(user) {
    var expires = expiresIn(1);
    var token = jwt.encode({
        exp: expires,
        user: user
    }, require("../config/secret.js")());
    
    console.log(token);
    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;