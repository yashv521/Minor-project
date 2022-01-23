//============================
// IMPORTS
//============================


//NPM Imports
const express =require('express');
const app =express();
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const morgan = require('morgan')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');


//config Imports
try{
	var config =require('./config');
}
catch (e){
	console.log("Could not import config. This is probably means you're not working locally");
	console.log(e);
}


//Route Imports
const placementRoutes=require('./routes/placement')
const commentRoutes=require('./routes/comments')
const mainRoutes=require('./routes/main')
const authRoutes = require("./routes/auth");

//Model Imports
const Rest =require('./models/rest');
const Comment= require('./models/comment');
const User = require('./models/user');

//============================
//DEVLOPMENT
//============================
// Morgan
app.use(morgan('tiny'))

// Seed to DB

// const seed=require('./utils/seed');
// seed();

//============================
// CONFIG
//============================

//Connect to db
try{
	mongoose.connect('mongodb://127.0.0.1:27017/rest');
}
catch{
	console.log("Could not connect using config. This probably means you are not working locally");
	mongoose.connect(process.env.DB_CONNECTION_STRING);
}

// Express Config
app.set("view engine","ejs");
app.use(express.static('public'));

// Body parser Config
app.use(bodyParser.urlencoded({extended: true}));

//Express Session Config
app.use(expressSession({
	secret : process.env.ES_SECRET || config.expressSession.secret,
	resave: false,
	saveUninitialized: false
}));

//Method Override Config
app.use(methodOverride('_method'));

// Connect flash 
app.use(flash());

//Passport Config
app.use(passport.initialize());
app.use(passport.session());   //Allows persistent sessions
passport.serializeUser(User.serializeUser()); // What data Should be stored in session
passport.deserializeUser(User.deserializeUser()); //Get the user data from the stored session
passport.use(new LocalStrategy(User.authenticate())); // Use the local strategy


// Current User Middleware config
app.use((req ,res ,next) => {
	res.locals.user = req.user;
	next();
})

// Route Config
app.use("/", mainRoutes);
app.use("/", authRoutes);
app.use("/placement/:id/comments",commentRoutes);
app.use("/placement",placementRoutes);

//============================
// LISTEN
//============================


app.listen(process.env.PORT || 3000,()=>{
	console.log("Placement-site is running....");
});