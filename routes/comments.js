var express = require("express"),
    router  = express.Router();
//    router  = express.Router({mergeParams: true});
    
var Recipe  = require("../models/recipe"),
    Comment    = require("../models/comment");
var middleware = require("../middleware");
    
    
// NEW COMMENT
router.get("/recipes/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Recipe.findById(req.params.id, function(err, recipe_result){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {recipe:recipe_result});
        }
    });
});


// CREATE COMMENT
router.post("/recipes/:id/comments", middleware.isLoggedIn, function(req, res){
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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //connect new comment to recipe
                    comment.save();
                    recipeResult.comments.push(comment);
                    recipeResult.save();
                    console.log("COMMENT:::::::::::::::  "+comment);
                    //redirect to recipe show page
                    res.redirect("/recipes/"+ recipeResult._id);
                }
            });
        }
    });
});

// EDIT COMMENT
router.get("/recipes/:id/comments/:commentid/edit", middleware.checkCommentAuthor, function(req, res){
    Comment.findById(req.params.commentid, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {recipe_id:req.params.id, comment:comment});
        }
    })
});

// UPDATE COMMENT
router.put("/recipes/:id/comments/:commentid", middleware.checkCommentAuthor, function(req,res){
    Comment.findByIdAndUpdate(req.params.commentid, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");            
        } else {
            res.redirect("/recipes/"+req.params.id);
        }
    })
});

// DESTROY COMMENT
router.delete("/recipes/:id/comments/:commentid", middleware.checkCommentAuthor, function(req, res){
    Comment.findByIdAndRemove(req.params.commentid, function(err){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/recipes/"+req.params.id)
        }
    });
});


module.exports = router;
