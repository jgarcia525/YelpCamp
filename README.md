# YelpCamp


|================|
| RESTful Routes |
|================|

Campground Routes

name 					url								 method 				desc.
========================================================================================
INDEX 			/campgrounds					GET					Display a list of all campgrounds
NEW					/campgrounds/new 			GET					Displays form to make new campground
CREATE			/campgrounds  				POST				Adds new campground to DB
SHOW 				/campgrounds/:id 			GET					Shows info about one campground


Comment Routes

name 					url								 							 method 				desc.
===================================================================================
NEW					/campgrounds/:id/comments/new 			GET					Displays form to make new comment for a specific campground
CREATE			/campgrounds/:id/comments  					POST				Adds new comment to DB with reference to a campground
