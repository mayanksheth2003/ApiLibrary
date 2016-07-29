var Employee = require("../models/employee.js");

var employeeApi = {
    getAll: function (req, res) {
        Employee.find(function (err, employees) {
            if (err) {
                res.send(err);
            }
            res.json(employees);
        });
    },

    create: function (req, res) {
        var employee = new Employee();
        employee.name = req.body.name;
        employee.designation = req.body.designation;
        employee.salary = req.body.salary;

        employee.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Employee Created" });
        });
    },

    getById: function (req, res) {
        Employee.findById(req.params.employee_id, function (err, employee) {
            if (err) {
                res.send(err);
            }
            res.json(employee);
        });
    },

    updateById: function (req, res) {
        Employee.findById(req.params.employee_id, function (err, employee) {
            if (err) {
                res.send(err);
            }
            employee.name = req.body.name;
            employee.designation = req.body.designation;
            employee.salary = req.body.salary;

            employee.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: "Employee Updated" });
            });
        });
    },

    deleteById: function (req, res) {
        Employee.remove({
            _id: req.params.employee_id
        }, function (err, employee) {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Successfully deleted" });
        });
    }
};

module.exports = employeeApi;