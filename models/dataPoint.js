var mongoose = require("mongoose");
var schema = mongoose.Schema;

var dataPointSchema = new schema({
    key: String,
    value: String
});

module.exports = mongoose.model('DataPoint', dataPointSchema);