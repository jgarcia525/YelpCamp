var	express 			= require("express"),
		app 					= express(),
		bodyParser 		= require("body-parser"),
		mongoose			= require("mongoose"),
		passport 			= require("passport"),
		LocalStrategy = require("passport-local"),
		Campground  	= require("./models/campground"),
		Comment 			= require("./models/comment"),
		User					= require("./models/user"),
		seedDB 				= require("./seeds");
		

// App configuration
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// Delete all campgrounds in the database and populate it
// with sample data		
seedDB();

// Passport configuration
app.use(require("express-session")({
	secret: "Once again Rusty wins cutest dog!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==================== //
//  Landing Page Route  //
// ==================== //

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

// NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res) {
	res.render("campgrounds/new");
});

// CREATE - add new campground
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

// NEW - show form to create new commeet
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
	// find campground by id
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// CREATE - add new comment
app.post("/campgrounds/:id/comments", isLoggeIn, function(req, res) {
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
					// connect new comment to campground
					campground.comments.push(comment);
					campground.save();
					// redirect to campground show page
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});	
});

// ================= //
//  Register Routes  //
// ================= //

// show register form
app.get("/register", function(req, res) {
	res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if(err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/campgrounds");
		});
	});
});

// ============== //
//  Login Routes  //
// ============== //

// show login info
app.get("/login", function(req, res) {
	res.render("login");
});

// hanlding login logic
app.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
});

// ============= //
//  Logout Route  //
// ============= //

// logout user
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}


app.listen(3000, function() {
	console.log("YelpCamp Sever Has Started.");
});