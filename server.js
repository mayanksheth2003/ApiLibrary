var express = require("express");
var bodyParser = require("body-parser");
//var mongoose = require("mongoose");
var logger = require("morgan");
var http = require("http");
var path = require("path");
var engines = require('consolidate');

var routes = require("./routes/routes.js");
var port = process.env.PORT;
//var env = process.env.NODE_ENV || "development";
var app = module.exports = express();

//exports.connpool = mysql.createPool({
//    host: 'localhost',
//    user: "root",
//    password: "",
//    database: "test"
//})
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

//app.set("port", process.env.PORT); 
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
//if (env === "development") {
    //app.use(express.errorHandler());
//}

app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Access-Token,X-Key");
    next();
});


app.use("/api/s", [require("./middlewares/validateRequest.js")]);
app.use("/api", routes);

app.get("/", function (req, res) { 
    res.render('index.html');
});

app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});

/*
//app.get("/", routes.index);
//app.get("/partials/:name", routes.partials);
//app.get("*", routes.index);

/*mongoose.connect("mongodb://localhost:27017", function (err, database) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
});

connection.connect(function (err) {
    if (err) {
        throw err;
    }
    console.log("Connected to MySQL...");

    connection.query('SELECT * FROM people', function (err, results) {
        if (err) throw err;
        console.log(results);
    })
})
http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});*/