var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var recipes = [
            {title: "Hazel-glaze Poppy Seed Donuts", image: "https://source.unsplash.com/68A4Vq_2biY"},
            {title: "Oaty Biscuits", image: "https://source.unsplash.com/Py0QLFEAagY"},
            {title: "Carrot Soup", image: "https://source.unsplash.com/w6ftFbPCs9I"},
            {title: "Spanish Paella", image: "https://source.unsplash.com/Pt_YmiYm7a4"},
            {title: "Spinich and Ricotta Ravioli", image: "https://source.unsplash.com/IZzch3494jg"}
        ]

app.get("/", function(req, res){
   res.render("homepage"); 
});

// Route for rendering the "recipes" page.
app.get("/recipes", function(req, res){
        res.render("recipes", {recipes:recipes});
});

// Route 
app.post("/recipes", function(req, res){
    // get data from "create recipe" form
    //res.send(req.body);
    var recipe_title = req.body.recipe_title;
    var recipe_image = req.body.recipe_image;
    var newRecipe = {title: recipe_title, image: recipe_image}
    recipes.push(newRecipe);
    // redirect to "recipes" page
    res.redirect("/recipes");
});

// Route to 'create new recipe' form
app.get("/recipes/new", function(req, res){
   res.render("new_recipe"); 
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Pesky Belly server is running.");
});