var mongoose = require("mongoose"),
    Recipe   = require("./models/recipe"),
    Comment = require("./models/comment");
   // Note     = require("./models/note");

    
    
var sampleData = [
    
        {title: "Hazel-glaze Poppy Seed Donuts", 
        image: "https://source.unsplash.com/68A4Vq_2biY", 
        description: "Try these hazel-glaze poppy seed donuts yum"},
        
        {title: "Oaty Biscuits", 
        image: "https://source.unsplash.com/Py0QLFEAagY", 
        description: "Try these oaty biscuits yum"},
        
        {title: "Spanish Paella", 
        image: "https://source.unsplash.com/Pt_YmiYm7a4", 
        description: "Try this spanish paella yum"}
    ]
    
    
function seedDB(){
    
    //Remove all recipes from DB
    Recipe.remove({}, function(err){
       if(err){
           console.log(err);
       } else {
           console.log("Removed recipes");
            //Add sample data to DB
            sampleData.forEach(function(seedRecipe){
               Recipe.create(seedRecipe, function(err, sampleRecipe){
                   if(err){
                       console.log(err);
                   } else {
                       console.log("New recipe added.");
                       //Test Comments
                       Comment.create({
                           text: "This recipe is amazing!",
                           author: "Lily"
                       }, function(err, comment){
                           if(err){
                               console.log(err);
                           } else {
                               sampleRecipe.comments.push(comment);
                               sampleRecipe.save();
                               console.log("New comment create");
                           }
                       });
                   }
               }); 
            });
       } 
    });
    
   
}


module.exports = seedDB; 