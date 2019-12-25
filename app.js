'use strict' 
/**
  *Module dependencies 
**/

const express = require('express') 
const logger  = require('morgan') 
const path    = require('path')
const cors    = require('cors')
const fs           = require('fs')
const bodyParser =  require('body-parser') 
const appRouter = require('./routes/api') 
const app = express();

/** 
 * A middleware is a function that works over an http request 
 * To use a middleware in express application  , write it as :
 * app.use(middleware)
*/ 

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(bodyParser.json()) 
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', appRouter)
/**
 * Connect to the database and listen to error and open event 
 */
 
const CONFIG = require('./config') 
const  mongoose = require('mongoose') 
mongoose.connect(CONFIG.URL , CONFIG.OPTIONS) 
	
const  db = mongoose.connection 
db.on('error' , console.error.bind(console , 'MongoDB connection error'))
db.on('open' , console.info.bind(console , 'Connection was okkkk'))

module.exports = app;
