const Comment = require("../models/comment");

const checkCommentAuthor = async(req,res,next) =>{
	if(req.isAuthenticated()){ // Check if the user is logges in 
		//If logged in check if they own the comment
		const comment= await Comment.findById(req.params.commentId).exec();		
		if(comment.user.id.equals(req.user._id)){
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

module.exports = checkCommentAuthor;