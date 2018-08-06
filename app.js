var	express 				= require("express"),
		app 						= express(),
		bodyParser 			= require("body-parser"),
		mongoose				= require("mongoose"),
		flash						= require("connect-flash"),
		passport 				= require("passport"),
		LocalStrategy 	= require("passport-local"),
		methodOverride  = require("method-override"),
		Campground  		= require("./models/campground"),
		Comment 				= require("./models/comment"),
		User						= require("./models/user"),
		seedDB 					= require("./seeds");

// Requiring routes
var commentRoutes 	 = require("./routes/comments"),
		campgroundRoutes = require("./routes/campgrounds"),
		indexRoutes			 = require("./routes/index");

// set the port of our application
// process.env.PORT lets the port to be set by Heroku
var port = process.env.PORT || 3000;


// App configuration
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(port, function() {
	console.log("YelpCamp Sever Has Started.");
});