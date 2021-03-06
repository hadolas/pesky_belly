var mongoose = require("mongoose");

//RECIPE SCHEMA
var recipeSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
//RECIPE MODEL
var Recipe = mongoose.model("Recipe", recipeSchema);
module.exports =Recipe;