var express = require("express");

var dataPointApi = require("../api/dataPointApi.js");
var accountsApi = require("../api/accountApi.js");
var deviceApi = require("../api/deviceApi.js");

var auth = require("../middlewares/auth.js");
var router = express.Router();

router.post("/register", auth.register);
router.post("/authenticate", auth.login);
//router.post("/setup", variablesApi.setupDB);

//variables routes
router.get('/s/u/dataPoints', dataPointApi.getAll);
router.post('/dataPoints', dataPointApi.create);
router.get('/dataPoints/:key', dataPointApi.getByKey);
router.put('/dataPoints/:key', dataPointApi.updateByKey);
router.delete('/dataPoints/:key', dataPointApi.deleteByKey);

//archival data routes
router.get('/archived', dataPointApi.getArchived);

//account routes
router.post('/signup', accountsApi.create);
router.post('/login', accountsApi.login);
//router.put('/update/:id', accountsApi.updateAccount); // TODO
//router.delete('/deactivate/:id', accountsApi.deactivate); // TODO

//device routes
router.get('/gateways', deviceApi.getAllGateways);
router.post('/gateways', deviceApi.createGateway);
router.get('/gateways/:id', deviceApi.getGatewayById);
router.put('/gateways/:id', deviceApi.updateGatewayById);
router.delete('/gateways/:id', deviceApi.deleteGatewayById);
router.get('/modules', deviceApi.getAllModules);
router.post('/modules', deviceApi.createModule);
router.get('/modules/:id', deviceApi.getModuleById);
router.put('/modules/:id', deviceApi.updateModuleById);
router.delete('/modules/:id', deviceApi.deleteModuleById);
router.get('/devices', deviceApi.getAllDevices);
router.post('/devices', deviceApi.createDevice);
router.get('/devices/:id', deviceApi.getDeviceById);
router.put('/devices/:id', deviceApi.updateDeviceById);
router.delete('/devices/:id', deviceApi.deleteDeviceById);

module.exports = router;