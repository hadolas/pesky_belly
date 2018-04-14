var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Recipe = require("./models/recipe");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/pesky_belly");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

seedDB();

//ADD RECIPE TO DATABASE
// Recipe.create({
//     title: "Spanish Paella", 
//     image: "https://source.unsplash.com/Pt_YmiYm7a4", 
//     description: "Try this spanish paella yum"
// }, function(err, recipe){
//     if(err){
//         console.log(err);
//     } else {
//         console.log("NEW RECIPE\n", recipe);
//     }
// });

//ROUTE: RENDER HOMEPAGE
app.get("/", function(req, res){
   res.render("homepage"); 
});

//INDEX ROUTE: Show all recipes
app.get("/recipes", function(req, res){
    Recipe.find({}, function(err, recipe_results){
        if(err){
            console.log(err);
        } else {
            res.render("index_recipes", {recipes:recipe_results});  
        }
    })    
});

//CREATE ROUTE: Add recipe to database
app.post("/recipes", function(req, res){
    // get data from "create recipe" form
    //res.send(req.body);
    var recipe_title = req.body.recipe_title;
    var recipe_image = req.body.recipe_image;
    var recipe_description = req.body.recipe_description;
    var newRecipe = {title: recipe_title, image: recipe_image, description: recipe_description}
    
    //Add recipe to db
        Recipe.create(newRecipe, function(err, new_recipe){
            if(err){
                console.log(err);
            } else {
                console.log("NEW RECIPE\n", new_recipe);
                //REDIRECT TO "/recipes" PAGE
                res.redirect("/recipes");
            }
        });
});

//NEW - Render 'create new recipe' form
app.get("/recipes/new", function(req, res){
   res.render("new_recipe"); 
});

//SHOW - Show one recipe (in more detail)
app.get("/recipes/:id", function(req, res){
    Recipe.findById(req.params.id, function(err, recipe_result){
        if(err){
            console.log(err);
        } else {
            res.render("show", {recipe:recipe_result});     
        }
    });
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Pesky Belly server is running.");
});