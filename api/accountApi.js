var jwt = require("jwt-simple");
var mysql = require('mysql');
var bcrypt = require("bcryptjs");
var baseAuth = require('basic-auth');
var Q = require('q');

var pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'automation'
});

var accountApi = {
    create : function (req, res) {
        if (req.body.username && req.body.password) {
            var hash = bcrypt.hashSync(req.body.password);
            var apiKey = "someApiKey"; //TODO: Create API keys and Account Numbers
            pool.getConnection(function (err, conn) {
                conn.query('SELECT 1 FROM account WHERE AccName = ? ORDER BY AccName LIMIT 1', 
                    [req.body.username], function (err , results) {
                    if (err) {
                        console.log('Error locating: %s', err);
                        res.json({ message: "Something went wrong! Please try again later." });
                        return;
                    }
                    if (results != null && results.length > 0) {
                        console.log('Account already exists!!');
                        res.json({ message: "Account already exists!!" });
                        return;
                    } else {
                        conn.query('INSERT INTO account(AccId, AccName, AccPassword, RoleId, AccAPIKey, Created) VALUES (1, ?, ?, 2, ?, now())', 
                            [req.body.username, hash, apiKey], function (err, results) {
                            if (err) {
                                console.log('error creating account: %s', err);
                            }
                            res.json({ message: 'Account created' });
                        });
                    }
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
    },

    login : function (req, res) {
        var creds = baseAuth(req);
        if (!creds || !creds.name || !creds.pass) {
            res.status(401);
            res.json({ message : "No credentials supplied." });
        } else {
            var username = creds.name;
            var password = creds.pass;

            accountApi.validateUser(username, password)
            .then(function (result) {
                if (result) {
                    res.json(genToken(result));
                }
            })
            .fail(function (err) {
                res.status(401);
                res.json({ message: "Invalid Credentials." });
            })
            .done();
        }
    },

    validateUser: function (username, password) {
        var deferred = Q.defer();
        if (username && password) {
            pool.getConnection(function (err, conn) {
                conn.query('SELECT * FROM account WHERE AccName = ? ORDER BY AccName LIMIT 1', [username], function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    } else if (results) {
                        if (bcrypt.compareSync(password, results[0].AccPassword)) {
                            deferred.resolve(results[0]);
                        }
                    }
                });
                conn.release();
            });
        }
        return deferred.promise;
    },

    validateApiKey: function (user) {
        var deferred = Q.defer();
        console.log(user.AccName);
        if (user) {
            pool.getConnection(function (err, conn) {
                conn.query('SELECT * from account WHERE AccName = ? ORDER BY AccName LIMIT 1', [user.AccName], function (err, results) {
                    if (err) {
                        deferred.reject(err);
                    } else if (results[0].AccAPIKey == user.AccAPIKey) {
                        deferred.resolve(results[0].RoleId);
                    } else {
                        deferred.reject('Invalid API Key');
                    }
                });
                conn.release();
            });
        }
        return deferred.promise;
    },
   
};

function genToken(user) {
    var expires = expiresIn(1);
    var token = jwt.encode({
        exp: expires,
        user: user
    }, require("../config/secret.js")());
    
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

module.exports = accountApi;