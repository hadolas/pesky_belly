var express = require("express"),
    router  = express.Router();
//    router  = express.Router({mergeParams: true});
    
var Recipe  = require("../models/recipe"),
    Comment    = require("../models/comment");
    
    
// NEW COMMENT
router.get("/recipes/:id/comments/new", isLoggedIn, function(req, res){
    Recipe.findById(req.params.id, function(err, recipe_result){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {recipe:recipe_result});
        }
    });
});


// CREATE COMMENT
router.post("/recipes/:id/comments", isLoggedIn, function(req, res){
    //lookup recipe using ID
    Recipe.findById(req.params.id, function(err, recipeResult){
        if(err){
            console.log(err);
            res.redirect("/recipes");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //connect new comment to recipe
                    recipeResult.comments.push(comment);
                    recipeResult.save();
                    //redirect to recipe show page
                    res.redirect("/recipes/"+ recipeResult._id);
                }
            });
        }
    });
});


// MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
