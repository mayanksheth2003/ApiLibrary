var mysql = require('mysql');
var Q = require('q');
//var setupquery = 'USE test; CREATE TABLE `user` (`id` tinyint(4) NOT NULL,`username` varchar(255) NOT NULL,`password` varchar(255) NOT NULL, `created` datetime NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1; CREATE TABLE `variables` (`id` int(10) NOT NULL,`varKey` varchar(255) NOT NULL,`varValue` varchar(255) NOT NULL,`created` datetime DEFAULT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1; CREATE TABLE `variables_archive` (`varKey` varchar(255) NOT NULL,`varValue` varchar(255) NOT NULL,`Created` date NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1; ALTER TABLE `user` ADD PRIMARY KEY (`id`);ALTER TABLE `variables` ADD PRIMARY KEY (`id`);ALTER TABLE `user` MODIFY `id` tinyint(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;ALTER TABLE `variables` MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;';
var pool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "",
    database: 'automation'
});

var dataPointApi = {
    setupDB: function (req, res) {
        pool.getConnection(function (err, conn) {
            conn.query(setupquery, function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json({ message: "Database created." });
                conn.release();
            });
        });
    },

    getAll: function (req, res) {
        pool.getConnection(function (err, conn) {
            conn.query('SELECT DP_Key, DP_Value, Created FROM dataPoint', function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });    
    },
    
    create: function (req, res) {
        pool.getConnection(function (err, conn) {
            var varKey, varValue;
            var isLogged = 0;
            var varType = 0;

            if (req.body.key && req.body.value) {
                varKey = req.body.key;
                varValue = req.body.value;
                isLogged = req.body.Logging != null ? req.body.Logging : 0;
                varType = req.body.typeof;
                 
                conn.query('INSERT INTO dataPoint(DP_Key, DP_Value, IsLogged, TypeOf, Created, LastUpdated) VALUES(?, ?, ?, ?, now(), now())',
                    [varKey, varValue, isLogged, varType], function (err, result) {
                    if (err) {
                        console.log('Error creating: %s', err);
                    }
                    res.json({ message: "DataPoint created." });
                });
            } else {
                res.json({ message: "Please provide key/value pair." });
            }
            conn.release();
        });
    },

    getByKey: function (req, res) {
        pool.getConnection(function (err, conn) {
            var varKey = req.params.key;

            conn.query('SELECT * FROM dataPoint WHERE DP_Key = ?', [varKey], function (err, result) {
                if (err) {
                    console.log('Error locating: %s', err);
                }
                res.json(result);
            });
            conn.release();
        });
    },

    updateByKey: function (req, res) {
        pool.getConnection(function (err, conn) {
            var varKey = req.params.key;
            if (req.body.value) {
                varValue = req.body.value;
            }
            
            dataPointApi.verifyLogging(varKey, conn)
            .then(function (result) {
                if (result) {
                    conn.query('UPDATE dataPoint SET DP_Value = ?, LastUpdated = now() WHERE DP_Key = ?', [varValue, varKey], function (err, result) {
                        if (err) {
                            console.log('Error updating: %s', err);
                        }
                        res.json({ message: "DataPoint updated." });
                    });
                    conn.release();
                }
            })
            .fail(function (err) {
                res.json({ "message": "Error updating datapoint" });
            })
            .done();
        });
    },

    deleteByKey: function (req, res) {
        pool.getConnection(function (err, conn) {
            var varKey = req.params.key;
            conn.query('DELETE FROM dataPoint WHERE DP_Key = ?', [varKey], function (err, rows) {
                if (err) {
                    console.log('Error deleting %s', err);
                }
                res.json({ message: "DataPoint deleted." });
            });
            conn.release();
        });
    },

    getArchived: function (req, res) {
        pool.getConnection(function (err, conn) {
            conn.query('SELECT * FROM datapoint_archive', function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });
    },

    verifyLogging : function (varKey, conn) {
        var deferred = Q.defer();
        if (varKey) {
            conn.query('SELECT IsLogged FROM dataPoint WHERE DP_Key = ? ORDER BY DP_Key LIMIT 1', [varKey], function (err, result) {
                if (err) {
                    console.log('Error retrieving data point: %s', err);
                    res.json({ message: "Error updating data point. Please try again later." });
                    deferred.reject(err);
                }
                if (result != null && result.length > 0) {
                    if (result[0].IsLogged == 1) {
                        conn.query('INSERT INTO dataPoint_archive(DP_Key, DP_Value, TypeOf, Created) SELECT DP_Key, DP_Value, TypeOf, LastUpdated FROM dataPoint WHERE DP_Key = ?',
                            [varKey], function (err, result) {
                            if (err) {
                                console.log("Error inserting to archive:" , err);
                            }
                            deferred.resolve(true);
                        });
                    }
                }
            });
        }
        return deferred.promise;
    }
};

module.exports = dataPointApi;
