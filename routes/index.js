var express = require("express"),
    router  = express.Router();
    
var User     = require("../models/user"),
    passport = require("passport");



// ROOT ROUTE: RENDER HOMEPAGE
router.get("/", function(req, res){
   res.render("homepage"); 
});

//=============
// AUTH ROUTES
//=============

//Signup form
router.get("/signup", function(req, res) {
    res.render("signup");
});
//Signup logic 
router.post("/signup", function(req, res){
    var newUser = new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/recipes"); 
        });
    });
});


//Login form
router.get("/login", function(req, res){
   res.render("login"); 
});
//Login logic
router.post("/login", passport.authenticate("local",
    {
        successRedirect:"/recipes", 
        failureRedirect:"/login"
        
    }), function(req, res){
});


//Logout route
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});


// MIDDLEWARE
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;