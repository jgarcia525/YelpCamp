var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// =================== //
//  Campground Routes  //
// =================== //

// INDEX - show all campgrounds
router.get("/", function(req, res) {
	// Get all campgrounds from DB
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
});

// NEW - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// CREATE - add new campground
router.post("/", middleware.isLoggedIn, function(req, res) {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author}
	
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

// SHOW - show more info about one campground
router.get("/:id", function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found");
			res.redirect("back");
		} else {
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT - edit a campground's information
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground})	
	});
});

// UPDATE - update campground information
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY - delete a campground
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

module.exports = router;