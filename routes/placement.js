const express= require('express');
const Rest =require('../models/rest');
const router =express.Router();
const Comment= require('../models/comment');
const isLoggedIn=require('../utils/isLoggedIn');
const checkRestAuthor = require('../utils/checkRestAuthor');

//INDEX
router.get("/", async(req,res) => {
	console.log(req.user);
	try{
		const rests = await Rest.find().exec();
		res.render("placement",{placement:rests});
	}
	catch(err){
		console.log(err);
		res.send("you broki it .../index");
	}	
});

// Create

router.post("/", isLoggedIn , async(req,res) => {
	console.log(req.body);
	const genre =req.body.genre.toLowerCase();
	const newRest= {
		title: req.body.title,
		description: req.body.description,
		Emailid: req.body.Emailid,
		linkedn: req.body.linkedn,
		Date : req.body.date,		
		genre: genre,
		batch: req.body.batch,
		oncampus: !!req.body.oncampus,
		image_link: req.body.image_link,
		author: {
			id: req.user._id,
			username: req.user.username
		}
	}
	try{
		const rest = await Rest.create(newRest)	;
		console.log(rest)
		res.redirect("/placement/"+rest.id);
	}
	catch(err){
		console.log(err);
		rest.redirect("/placement");
	}
	// placement.push(req.body)
	
});


// NEW route to be ID route otherwise it will shown never 
router.get("/new", isLoggedIn ,(req,res)=>{
	res.render("placement_new");	
});

// Search
router.get("/search",async (req,res) => {
	try {
		const rest=await Rest.find({
			$text:{
				$search:req.query.term
			}
		});
		res.render("placement",{placement:rest});
	} catch(err){
		console.log(err);
		res.send("Broken again")
	}
})

//Genre
router.get("/genre/:genre",async(req,res) => {
	//Check if the given genre is valid 
	const validGenres = ["infosys","tcs","cognizant","zopsmart","google","amazon","tesla","byjus","paytm"];
	if(validGenres.includes(req.params.genre.toLowerCase())) {
		// If yes , continue 
		const rest= await Rest.find({genre:req.params.genre}).exec();
		
		res.render("placement",{placement:rest});
		
	} else {
		res.send("Please enter a valid genre")
		// If no, send an error	
	}
	
	
});

//Show

router.get("/:id",async (req,res)=> {
	try {
		const rest= await Rest.findById(req.params.id).exec()
		const comments = await Comment.find({restId:req.params.id});
		res.render("placement_show",{rest,comments})
	}
	catch(err){
		console.log(err);
		res.send("You broke it ... /placement/:id");
	}
	
})

//Edit

router.get("/:id/edit",checkRestAuthor, async (req,res)=> {
	
	const rest= await Rest.findById(req.params.id).exec();
	res.render("placement_edit",{rest});
})

//Update

router.put("/:id", checkRestAuthor, async(req,res) => {
	console.log(req.body);
	const genre =req.body.genre.toLowerCase();
	const rest= {
		title: req.body.title,
		description: req.body.description,
		Emailid: req.body.Emailid,
		linkedn: req.body.linkedn,
		Date : req.body.date,		
		genre: genre,
		batch: req.body.batch,
		oncampus: !!req.body.oncampus,
		image_link: req.body.image_link
	}
	try{
		const updatedRest =await Rest.findByIdAndUpdate(req.params.id, rest, {new: true} ).exec();
		console.log(updatedRest);
		res.redirect(`/placement/${req.params.id}`);
	}catch(err){
		console.log(err);
		res.send("You broke it ... /placement/:id");
	}	
})


//Delete

router.delete("/:id",checkRestAuthor ,async (req,res) => {
	try{
		const deletedRest = await Rest.findByIdAndDelete(req.params.id).exec()
		console.log("Deleted:",deletedRest);
		res.redirect("/placement");
	}catch{
		console.log(err);
		res.send("You broke it ... /placement/:id");
	}
})

module.exports=router;