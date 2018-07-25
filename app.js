var Campground  = require("./models/campground"),
		Comment 		= require("./models/comment"),
		bodyParser 	= require("body-parser"),
		mongoose		= require("mongoose"),
		seedDB 			= require("./seeds"),
		express 		= require("express"),
		app 				= express();

// App configuration
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Delete all campgrounds in the database and populate it
// with sample data		
seedDB();


// Example code to make new campground

// var newCampground = {
//  name: "Granite Hill", 
//  image: "",
//  description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
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


// Landing page
app.get("/", function(req, res) {
	res.render("landing")
});


// =================== //
//  Campground Routes  //
// =================== //

// INDEX - show all campgrounds
app.get("/campgrounds", function(req, res) {
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

// CREATE - add new campgrounds
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
	res.render("campgrounds/new");
});


// SHOW - show more info about one campground
app.get("/campgrounds/:id", function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
})

// ================= //
//  Comments Routes  //
// ================= //

app.get("/campgrounds/:id/comments/new", function(req, res) {
	// find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res) {
	// lookup campground using ID
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
			res.redirect("/campgrounds")
		} else {
			// create new comment
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					// connect new commnet to campground
					campground.comments.push(comment);
					campground.save();
					// redirect to campground show page
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});	
});

app.listen(3000, function() {
	console.log("YelpCamp Sever Has Started.");
});