const mongoose =require("mongoose");

const restSchema =new mongoose.Schema({
	title:String,
	description:String,
	Emailid: String,
	linkedn: String,
	Date : Date,
	genre: String,
	batch: Number,
	oncampus:Boolean,
	image_link:String,
	author: {
		id: {
			type : mongoose.Schema.Types.ObjectId,
			ref : "User"
		},
		username : String
	}
})

restSchema.index({
	'$**' :'text'
});
module.exports=mongoose.model("rest",restSchema);