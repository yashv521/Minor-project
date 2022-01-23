const Rest= require('../models/rest');
const Comment = require('../models/comment');


const rest_seeds = [
	
]

const seed= async () =>{
	//Delete all the current placement and comments 
	await Rest.deleteMany();
	console.log("Deleted All the placement");
	
	await Comment.deleteMany();
	console.log("Deleted All the Comments");
	
	// Create three new profile
	// for (const rest_seed of rest_seeds) {
	// 	let rest = await Rest.create(rest_seed);
	// 	console.log("created a new Rest",rest.title);
	// 	//Create a new comment for each placement
	// 	await Comment.create( {
	// 		text : "I went to the Placement ",
	// 		user : "scoby_doo",
	// 		restId:rest._id
	// 	})
	// 	console.log("created a new comment!")
	// }
	
	
}

module.exports=seed;