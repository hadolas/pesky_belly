var mongoose = require("mongoose");

// NOTE SCHEMA
var noteSchema = new mongoose.Schema({
    text: String
});

//NOTE MODEL
var Note = mongoose.model("Note", noteSchema);

module.exports = Note;

