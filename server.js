//initialize Express app
var express = require('express');
var mongoose = require("mongoose");
var expressHandlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var app = express();
// Set up express Router
var router = express.Router();

//require our routes file pass our router object
require("./config/route")(router);

//Designate our public folder as a statis directory
app.use(express.static(__dirname + "/public"));

//Connect handlebars to our express app
app.engine("handlebars", expressHandlebars({
    defaultLayout: "main"
}))
app.set("view engine", "handlebars");

//Use bodyParser in our app
app.use(bodyParser.urlencoded({
    extended: false
}))

//Have every request go through our router middelware 
app.use(router);

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines"; { useNewUrlParser: true } 

mongoose.connect(MONGODB_URI, function(error){
    if (error) {
        console.log(error);
    }
    else {
        console.log("mongoose connection successful");
    }
});



//Set up port 
var port = process.env.PORT || 3000;

//Listen on the port 
app.listen(port, function(){
  console.log('Listening on PORT ' + port);
});
