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
    
var recipeRoutes = require("./routes/recipes"),
    noteRoutes   = require("./routes/notes"),
    indexRoutes  = require("./routes/index");

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

app.use("/", indexRoutes);
app.use(recipeRoutes);
app.use(noteRoutes);


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("The Pesky Belly server is running.");
});