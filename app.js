var express 		= require("express"),
		app 				= express();
		bodyParser 	= require("body-parser"),
		mongoose		= require("mongoose");

// Connects to MongoDB database
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// Schema Setup for MongoDB
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

// Compile Schema into model
var Campground = mongoose.model("Campground", campgroundSchema);

// var newCampground = {
// 	name: "Granite Hill", 
// 	image: "https://images.unsplash.com/photo-1506535995048-638aa1b62b77?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=f3e3ff1cce6d43ff22a50a83269f07ac&auto=format&fit=crop&w=1950&q=80",
// 	description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
// };

// Campground.create(newCampground, function(err, campground) {
// 		if(err) {
// 			console.log(err);
// 		} else {
// 			// redirect back to campgrounds page, if it was 
// 			// successfully added
// 			console.log("NEWLY CREATED CAMPGROUND");
// 		}
// });

// var campgrounds = [
// 	{name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-882244782"},
// 	{name: "Granite Hill", image: "https://photosforclass.com/download/flickr-5641024448"},
// 	{name: "Moutain Goat's Rest", image: "https://photosforclass.com/download/flickr-8050540841"},
// 	{name: "Salmon Creek", image: "https://photosforclass.com/download/flickr-882244782"},
// 	{name: "Granite Hill", image: "https://photosforclass.com/download/flickr-5641024448"},
// 	{name: "Moutain Goat's Rest", image: "https://photosforclass.com/download/flickr-8050540841"}
// ];

// 
app.get("/", function(req, res) {
	res.render("landing")
});

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {campgrounds: allCampgrounds});
		}
	})
});

// CREATE -  add new campgrounds
app.post("/campgrounds", function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc}
	// create a new campground and save to DB
	Campground.create(newCampground, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			// redirect back to campgrounds page, if it was 
			// successfully added
			res.redirect("/campgrounds");
		}
	});
});

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("new");
});


// SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			// render show template with that campground
			res.render("show", {campground: foundCampground});
		}
	});
})

app.listen(3000, function() {
	console.log("Yelp Camp Sever Has Started!");
});