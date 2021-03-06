var express = require("express"),
    router  = express.Router();
    
var Recipe  = require("../models/recipe");
var middleware = require("../middleware");


//INDEX ROUTE: Show all recipes
router.get("/recipes", function(req, res){
    Recipe.find({}, function(err, recipe_results){
        if(err){
            console.log(err);
        } else {
            res.render("recipes/index_recipes", {recipes:recipe_results});  
        }
    })    
});

//CREATE ROUTE: Add recipe to database
router.post("/recipes", middleware.isLoggedIn, function(req, res){
    // get data from "create recipe" form
    //res.send(req.body);
    var recipe_title = req.body.recipe_title;
    var recipe_image = req.body.recipe_image;
    var recipe_description = req.body.recipe_description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newRecipe = {title: recipe_title, image: recipe_image, description: recipe_description, author: author}
    
    //Add recipe to db
        Recipe.create(newRecipe, function(err, new_recipe){
            if(err){
                console.log(err);
            } else {
                //console.log(new_recipe);
                //REDIRECT TO "/recipes" PAGE
                res.redirect("/recipes");
            }
        });
});

//NEW - Render 'create new recipe' form
router.get("/recipes/new", middleware.isLoggedIn, function(req, res){
   res.render("recipes/new_recipe"); 
});

//SHOW - Show one recipe (in more detail)
router.get("/recipes/:id", function(req, res){
    Recipe.findById(req.params.id).populate("comments").exec(function(err, recipe_result){
        if(err){
            console.log(err);
        } else {
            console.log(recipe_result);
            res.render("recipes/show", {recipe:recipe_result});     
        }
    });
});

//EDIT - Route to edit a recipe
router.get("/recipes/:id/edit", middleware.checkRecipeAuthor, function(req, res){
        
    Recipe.findById(req.params.id, function(err, recipe_result){
        res.render("recipes/edit", {recipe: recipe_result}); 
    });
});

//UPDATE - Route for updating a recipe
router.put("/recipes/:id", middleware.checkRecipeAuthor, function(req, res){
    Recipe.findByIdAndUpdate(req.params.id, req.body.recipe, function(err, updatedRecipe){
        if(err){
            console.log(err);
        } else {
            res.redirect("/recipes/"+req.params.id);
        }
    });
});

//DESTROY - Route for deleting a recipe
router.delete("/recipes/:id", middleware.checkRecipeAuthor, function(req, res){
    Recipe.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/recipes");
        } else {
            res.redirect("/recipes");
        }
        
    });
});


module.exports = router;
