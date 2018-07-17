var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
	{name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-882244782"},
	{name: "Granite Hill", image: "https://photosforclass.com/download/flickr-5641024448"},
	{name: "Moutain Goat's Rest", image: "https://photosforclass.com/download/flickr-8050540841"}
];

app.get("/", function(req, res) {
	res.render("landing")
});

app.get("/campgrounds", function(req, res) {
	res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image}
	campgrounds.push(newCampground);
	// redirect back to campgrounds page
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new")
});

app.listen(3000, function() {
	console.log("Yelp Camp Sever Has Started!");
});