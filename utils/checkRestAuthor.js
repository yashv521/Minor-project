const Rest = require("../models/rest");

const checkRestAuthor = async(req,res,next) =>{
	if(req.isAuthenticated()){ // Check if the user is logges in 
		//If logged in check if they own the placement
		const rest= await Rest.findById(req.params.id).exec();		
		if(rest.author.id.equals(req.user._id)){
			next();
		}
		else{
			// If not rediect back to show the page
			res.redirect("back");
		}
	} else {  // if not logged in ,rederict to /login	
		res.redirect("/login");
	} 
} 

module.exports = checkRestAuthor;