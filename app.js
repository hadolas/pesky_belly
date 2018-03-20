var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
   res.render("homepage"); 
});

app.get("/recipes", function(req, res){
    var recipes = [
            {name: "Hazel-glaze Poppy Seed Donuts", image: "https://source.unsplash.com/68A4Vq_2biY"},
            {name: "Oaty Biscuits", image: "https://source.unsplash.com/Py0QLFEAagY"},
            {name: "Carrot Soup", image: "https://source.unsplash.com/w6ftFbPCs9I"},
            {name: "Spanish Paella", image: "https://source.unsplash.com/Pt_YmiYm7a4"},
            {name: "Spinich and Ricotta Ravioli", image: "https://source.unsplash.com/IZzch3494jg"}
        ]
        
        res.render("recipes", {recipes:recipes});
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Pesky Belly server is running.");
});