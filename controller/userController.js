'use strict' 
/**
  *Module dependencies 
**/

const  User = require('../model/user')
const Item = require('../model/item') 
const {check , validationResult } = require('express-validator') 
const {sanitizeBody }  = require('express-validator')
const {sanitizeParam } = require('express-validator')


//!Handle the home page 
exports.index = (req , res , next) => {
	const api_details = {
		name : "Todo List API" , 
		description : "A simple Mongodb , express , and node powered API for managing list of todos" , 
		developer   : "Adeleke Bright " , 
		endPoints   :  {
			'/api/v1.0.0' : "The default home section for the API" , 
			'/api/v1.0.0/signup' : "Endpoint for handling user registration"   , 
			'/api/v1.0.0/auth' : "Responsible for authenticating users with jwt" 
		}
	}
			
	res.json(api_details) 
}
//!Create a user 
exports.create_user = [
    //!Grab the data in the request body 
	check('userName' , 'Provide a valid name').isLength({min : 2 }).trim()  , 
	//!sanitize the field 
	sanitizeBody('userName').escape() , 
	(req , res , next) => { 
	//!check if errors in req 
	const errors = validationResult(req) 
	if (!errors.isEmpty() || !req.body) {
		res.status(400).json(errors.array())
	}
	let user = new User({
		firstName : req.body.firstName ,
		lastName  : req.body.lastName ,
		userName  : req.body.userName , 
		email     : req.body.email , 
		password  : req.body.password , 
		mobile    : req.body.mobile  , 
		gender : req.body.gender 
	})
	user.save((err , success) => {
		if ( err ) {
			res.status(500).send("Something bad happen , please try again") 
		}
		res.send('User was created successfully')
	})
}]
//! authenticate a user 
exports.check_user = (req , res , next ) => {
	res.send("Authentication of user is yet to be implemented")
}
//!Display a single user 
exports.user = (req , res , next) => {
	User.findById(req.params.id , function(err , user){
		if (err) {
			res.status(400).send('Bad Request') 
		}
		if ( !user ) {
			res.status(404).send('No user exists for this id')
		}else {
		    res.json(user) 
		}			
    })
}
//! Update a user account 
exports.update_user = (req , res , next) => {
	res.send("Updating of user account not implemented yet") 
}

//! Delete a user
exports.delete_user = (req , res , next) => {
	Item.find({'created_by' : req.params.id} , function(err , items) {
		if (err) {
			return next(err) 
		}
		//!Item.deleteOne , findByIdAndRemove
		Item.deleteMany({'created_by' : req.params.id} , function(err) {
			if (err) {
				res.status(500).send('Item was Internal Server error') 
			}
			User.findByIdAndRemove(req.params.id , function(err) {
				if (err) {
					res.status(500).send('Item was Internal Server error') 
				}else {
				    res.send('I don deletam') 
				}
			})
		})
	})
}
//!Get all users 
exports.users = (req , res , next) => {
	User.find() 
	.sort([['firstName' , 'descending']])
	.populate('user')
	.exec(function(err , user_list) {
		if (err) {
			res.status(500).send("Internal Server Error") 
		} 
		if ( user_list.length == 0 ) {
			let user_list = {
				name : "No user" 
			}
			res.json(user_list)
		}
		res.json(user_list)
	})
} 
