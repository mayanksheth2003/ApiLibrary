var mysql = require('mysql');
var pool = mysql.createPool({
    host: 'localhost',
    user: "root",
    password: "",
    database: 'automation'
});

var deviceApi = {

    /****** START Gateways API *********/
    getAllGateways: function (req, res) {
        pool.getConnection(function (err, conn) {
            conn.query('SELECT Id, AccId, ModuleId FROM Gateway', function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });
    },

    createGateway: function (req, res) {

    },

    getGatewayById: function (req, res) {
        pool.getConnection(function (err, conn) {
            var id = req.params.id;
            conn.query('SELECT Id, AccId, ModuleId FROM Gateway WHERE Id = ?', [id], function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });
    },

    updateGatewayById: function (req, res) {

    },

    deleteGatewayById: function (req, res) {
        pool.getConnection(function (err, conn) {
            var gatewayId = req.params.id;
            
            conn.query('DELETE FROM Gateway, Module, Device USING Gateway INNER JOIN Module INNER JOIN Device WHERE Gateway.Id = ? AND Module.Id = Gateway.ModuleId AND Device.Id = Module.DeviceId',
                [gatewayId], function (err, rows) {
                if (err) {
                    console.log('Error deleting gateway %s', err);
                }
                res.json({ message : "Gateway deleted." });
            });
        });
    },
    /****** END Gateways API ***********/
    
    /****** START Modules API **********/
    getAllModules: function (req, res) {
        pool.getConnection(function (err, conn) {
            conn.query('SELECT Id, DeviceId FROM Module', function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });
    },

    createModule: function (req, res) {

    },

    getModuleById: function (req, res) {
        pool.getConnection(function (err, conn) {
            var id = req.params.id;
            conn.query('SELECT Id, DeviceId FROM Module WHERE Id = ?', [id], function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });
    },

    updateModuleById: function (req, res) {

    },

    deleteModuleById: function (req, res) {
        pool.getConnection(function (err, conn) {
            var moduleId = req.params.id;
            console.log('Module ID:: ' + moduleId);
            conn.query('DELETE FROM Module, Device USING Module INNER JOIN Device WHERE Module.Id = ? AND Device.Id = Module.DeviceId',
                [moduleId], function (err, rows) {
                if (err) {
                    console.log('Error deleting gateway %s', err);
                }
                res.json({ message : "Module deleted." });
            });
        });
    },
    /****** END Modules API ************/
    
    /****** START Device API ***********/
    getAllDevices: function (req, res) {
        pool.getConnection(function (err, conn) {
            conn.query('SELECT * FROM Device', function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });
    },

    createDevice: function (req, res) {

    },

    getDeviceById: function (req, res) {
        pool.getConnection(function (err, conn) {
            var id = req.params.id;
            conn.query('SELECT * FROM Device WHERE Id = ?', [id], function (err, rows) {
                if (err) {
                    console.log('Error selecting: %s', err);
                }
                res.json(rows);
            });
            conn.release();
        });
    },

    updateDeviceById: function (req, res) {

    },

    deleteDeviceById: function (req, res) {
        pool.getConnection(function (err, conn) {
            var deviceId = req.params.id;
            
            conn.query('DELETE FROM Device WHERE Id = ?',
                [deviceId], function (err, rows) {
                if (err) {
                    console.log('Error deleting gateway %s', err);
                }
                res.json({ message : "Device deleted." });
            });
        });
    }
    /****** END Device API *************/
};

module.exports = deviceApi;