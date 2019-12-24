//! A basic todo list application using MERN . 
//! Design and Development of the Node powered server 
//! Require important dependencies 
const express = require('express') 
const logger  = require('morgan') 
const path    = require('path')
const cors    = require('cors')
const fs           = require('fs')
const bodyParser =  require('body-parser') 
const appRouter = require('./routes/api') 

const app = express();

//!Middleware 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())
app.use(bodyParser.json())
//! Configure sending of static files 
app.use(express.static(path.join(__dirname, 'public')));

//! Set up the application routes 
app.use('/', appRouter);
//!app.use('/users', usersRouter);
const options = {
	useNewUrlParser : true , 
	useCreateIndex : true , 
	poolSize : 10 , 
	keepAlive : true , 
	keepAliveInitialDelay : 300000
	
}
//! Connect to the database 
let mongoose = require('mongoose') 
mongoose.connect('mongodb://127.0.0.1/api' , options) 
	
let db = mongoose.connection 
db.on('error' , console.error.bind(console , 'MongoDB connection error'))
db.on('open' , console.info.bind(console , 'Connection was okkkk'))

module.exports = app;
