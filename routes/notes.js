var express = require("express"),
    router  = express.Router();
//    router  = express.Router({mergeParams: true});
    
var Recipe  = require("../models/recipe"),
    Note    = require("../models/note");
    
    
// NEW NOTE
router.get("/recipes/:id/notes/new", isLoggedIn, function(req, res){
    Recipe.findById(req.params.id, function(err, recipe_result){
        if(err){
            console.log(err);
        } else {
            res.render("notes/new", {recipe:recipe_result});
        }
    });
});


// CREATE NOTE
router.post("/recipes/:id/notes", isLoggedIn, function(req, res){
    //lookup recipe using ID
    Recipe.findById(req.params.id, function(err, recipeResult){
        if(err){
            console.log(err);
            res.redirect("/recipes");
        } else {
            //create new note
            Note.create(req.body.note, function(err, note){
                if(err){
                    console.log(err);
                } else {
                    //connect new note to recipe
                    recipeResult.notes.push(note);
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
