var DP = require("../models/dataPoint.js");

var dataPointApi = {
    getAll: function (req, res) {
        DP.find(function (err, dataPoint) {
            if (err) {
                res.send(err);
            }
            res.json(dataPoint);
        });
    },

    create: function (req, res) {
        var dataPoint = new DP();
        if (req.body.key && req.body.value) {
            dataPoint.key = req.body.key;
            dataPoint.value = req.body.value;
            
            dataPoint.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Datapoint created" });
            });
        } else {
            res.json({ message: "Please provide key/value pair." });
        }
    },

    getById: function (req, res) {
        DP.findById(req.params.dataPoint_id, function (err, dataPoint) {
            if (err) {
                res.send(err);
            }
            res.json(dataPoint);
        });
    },

    getByKey: function (req, res) {
        var query = { key: req.params.dataPoint_key };
        DP.find(query, function (err, dataPoint) {
            if (err) {
                res.send(err);
            }
            res.json(dataPoint);
        });
    },
    
    updateById: function (req, res) {
        DP.findById(req.params.dataPoint_id, function (err, dataPoint) {
            if (err) {
                res.send(err);
            }
            dataPoint.value = req.body.value;
            
            dataPoint.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "DataPoint updated" });
            });
        });
    },

    updateByKey: function (req, res) {
        DP.findOne({ "key" : req.params.dataPoint_key }, function (err, dataPoint) {
            if (err) {
                res.send(err);
            }
            dataPoint.value = req.body.value;
            
            dataPoint.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message : "DataPoint updated" });
            });
        });
    },

    deleteById: function (req, res) {
        DP.remove({
            _id : req.params.dataPoint_id
        }, function (err, dataPoint) {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Successfully deleted" });
        });
    },

    deleteByKey: function (req, res) {
        DP.findOneAndRemove({ "key": req.params.dataPoint_key }, function (err, dataPoint) {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Successfully deleted" });
        });
    }
};

module.exports = dataPointApi;