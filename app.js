var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("homepage"); 
});

app.get("/recipes", function(req, res){
    res.send("RECIPES PAGE");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Pesky Belly server is running.");
});