var express = require("express");
var app = express();

app.set("view engine", "ejs");


app.get("/", function(req, res) {
	res.render("landing")
});

app.get("/campgrounds", function(req, res) {
	var campgrounds = [
		{name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-882244782"},
		{name: "Granite Hill", image: "https://photosforclass.com/download/flickr-5641024448"},
		{name: "Moutain Goat's Rest", image: "https://photosforclass.com/download/flickr-8050540841"}
	];

	res.render("campgrounds", {campgrounds: campgrounds});
});


app.listen(3000, function() {
	console.log("Yelp Camp Sever Has Started!");
});