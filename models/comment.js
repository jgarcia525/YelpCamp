var mongoose = require("mongoose");

// Schema Setup
var commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
});

// Compile Schema into model
module.exports = mongoose.model("Comment", commentSchema);