var Recipe = require("../models/recipe");
var Comment = require("../models/comment");

// MIDDLEWARE
var middlewareObj = {};

middlewareObj.checkRecipeAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        //if user is logged in:
        Recipe.findById(req.params.id, function(err, recipe_result){
            if(err){
                res.redirect("back");
            } else {
                if(recipe_result.author.id.equals(req.user._id)){
                //if logged in user is author of recipe:
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        //if user is logged in:
        Comment.findById(req.params.commentid, function(err, comment_result){
            if(err){
                res.redirect("back");
            } else {
                if(comment_result.author.id.equals(req.user._id)){
                //if logged in user is author of comment:
                    next();
                } else {
                    res.redirect("back");
                }
            }
        });
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj; 