var mysql = require('mysql');

var pool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "",
    database: "test"
});

module.exports = pool;

//exports.getConnection = function (callback) {
//    pool.getConnection(function (err, conn) {
//        if (err) {
//            return callback(err);
//        }
//        callback(err, conn);
//    });
//};