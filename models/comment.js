var mongoose = require("mongoose");

// Schema Setup
var commentSchema = new mongoose.Schema({
	text: String,
	author: String
});

// Compile Schema into model
module.exports = mongoose.model("Comment", commentSchema);