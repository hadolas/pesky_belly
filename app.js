var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    passport   = require("passport"),
    LocalStrategy = require("passport-local"),
    Recipe     = require("./models/recipe"),
    Note       = require("./models/note"),
    User       = require("./models/user"),
    seedDB     = require("./seeds");

mongoose.connect("mongodb://localhost/pesky_belly");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public"));

seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "mountain",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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
            res.render("recipes/index_recipes", {recipes:recipe_results});  
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
   res.render("recipes/new_recipe"); 
});

//SHOW - Show one recipe (in more detail)
app.get("/recipes/:id", function(req, res){
    Recipe.findById(req.params.id).populate("notes").exec(function(err, recipe_result){
        if(err){
            console.log(err);
        } else {
            res.render("recipes/show", {recipe:recipe_result});     
        }
    });
});

//===========================
//           NOTES ROUTES
//===========================

app.get("/recipes/:id/notes/new", isLoggedIn, function(req, res){
    Recipe.findById(req.params.id, function(err, recipe_result){
        if(err){
            console.log(err);
        } else {
            res.render("notes/new", {recipe:recipe_result});
        }
    });
});

app.post("/recipes/:id/notes", isLoggedIn, function(req, res){
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

//AUTH ROUTES

app.get("/signup", function(req, res) {
    res.render("signup");
});

app.post("/signup", function(req, res){
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

app.get("/login", function(req, res){
   res.render("login"); 
});

app.post("/login", passport.authenticate("local",
    {
        successRedirect:"/recipes", 
        failureRedirect:"/login"
        
    }), function(req, res){
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Pesky Belly server is running.");
});