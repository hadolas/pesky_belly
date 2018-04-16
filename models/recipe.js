var mongoose = require("mongoose");

//RECIPE SCHEMA
var recipeSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Note"
        }
    ]
});
//RECIPE MODEL
var Recipe = mongoose.model("Recipe", recipeSchema);
module.exports =Recipe;