var mongoose = require("mongoose");
var schema = mongoose.Schema;

var EmployeeSchema = new schema({
    name: String,
    designation: String,
    salary: Number
});

module.exports = mongoose.model('Employee', EmployeeSchema);