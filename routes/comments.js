const express=require('express')
const router=express.Router({mergeParams:true});

const Comment= require('../models/comment');
const Rest =require('../models/rest');
const isLoggedIn=require('../utils/isLoggedIn');
const checkCommentAuthor=require('../utils/checkCommentAuthor');


//new Comment -Show form
router.get("/new",  isLoggedIn ,  (req,res)=> {
	res.render("comments_new",{restId: req.params.id})
})

// create Comments -Actually Update DB

router.post("/",  isLoggedIn , async(req,res)=> {
	const newComment = await Comment.create({
		user: {
			id: req.user._id,
			username: req.user.username
		},
		text:req.body.text,
		restId:req.body.restId
	})
	try{
		console.log(newComment);
		res.redirect(`/placement/${req.body.restId}`);
	}
	catch(err)
	{
		console.log(err);
		res.send("You broken again .. POST  comments")
	}
	//redirect to the show page for the placement
})

//Edit comment -show the form 
router.get("/:commentId/edit",  checkCommentAuthor , async(req,res) => {
	try {
		const rest= await Rest.findById(req.params.id).exec();
		const comment =await Comment.findById(req.params.commentId).exec();
		console.log("rest:",rest);
		console.log("comment:",comment);
		res.render("comments_edit",{rest,comment});
	}
	catch(err){
		console.log(err);	
		res.send("Broke Comment Edit Get")
	}
})

//Update comment -Actually update th DB

router.put("/:commentId",  checkCommentAuthor , async(req,res)=> {
	try{
		const comment=await Comment.findByIdAndUpdate(req.params.commentId,{text:req.body.text},{new:true});
		console.log(comment);
		res.redirect(`/placement/${req.params.id}`);
	}
	catch(err){
		console.log(err);
		res.send("Broke Again...")
	}
})

// Delete Comment -Duh
router.delete("/:commentId", checkCommentAuthor , async (req,res) => {
	try {
		const comment = await Comment.findByIdAndDelete(req.params.commentId);
		console.log(comment);
		res.redirect(`/placement/${req.params.id}`);
	}
	catch(err){
		console.log(err);
		res.send("Broken again comment DELETE")
	}
})





module.exports=router;