'use strict' 
/**
  *Module dependencies 
**/

const  User = require('../model/user')
const Item = require('../model/item') 
const {check , validationResult } = require('express-validator') 
const {sanitizeBody }  = require('express-validator')
const {sanitizeParam } = require('express-validator')

/**
 * index is the controller for our API root path 
 * The response is a json object with fields describing the API 
 * The endpoint for the application is listed so as to enable users 
 * The HTTP method allowed for each endpoint is also listed
 * work properly with the API.
 */
exports.index = (req , res , next) => {
	const api_details = {
		name        : "Todo List API" , 
		description : "A simple Mongodb , express\
		              , and node powered API for managing list of todos", 
		developer   : "Adeleke Bright " , 
		endPoints   :  {
			'/api/v1.0.0'  : "The default home section for the API :- GET", 
			'/api/v1.0.0/signup' : "Endpoint for handling registration :-POST", 
			'/api/v1.0.0/user'   : "List all users :-GET"  , 
			'/api/v1.0.0/user/:id' : "user endpoint :-GET , DELETE , PUT", 
			'/api/v1.0.0/user/:id/item' : "Endpoint for user items :-GET , POST"  , 
			'/api/v1.0.0/user/:id/item/:itemID' : "item endpoint:-GET , DELETE , PUT"  
		}
	}		
	res.json(api_details) 
}
/** 
 * Creating a user document 
 * The body of the reques is parsed by the body-parser middleware 
 * While using postman , set the content type to application/json 
 * select raw as the option in the body panel  , then enter your key and value 
 * Request from the user needs to be validated and sanitized before using them 
 * We are using express-validator to validate and clean the request 
 * @param [Object] req from the user 
 * @return [Object ] A user document 
 * refactoring of this code should include creating a an helper function for validation 
 */
//!Create a user 
exports.create_user = [
	check('firstName').isLength({min : 2 }).trim() 
        .withMessage('Length should be 2 or more characters long')
	    .matches(/^[a-zA-Z]+$/)
		.withMessage('firstname must contain only alphabets')	, 
		
	check('lastName').isLength({min : 2 }).trim() 
        .withMessage('Length should be 2 or more characters long')
	    .matches(/^[a-zA-Z]+$/).
		withMessage('last name must contain only alphabets'), 
		
	check('userName').isLength({min : 2 }).trim() 
        .withMessage('Length should be 2 or more characters long')
	    .matches(/^[a-zA-Z]+$/).withMessage('username must contain only alphabets')	
		.custom(value => {
        return User.findOne({'userName' : value}).then(user => {
            if (user ) {
                return Promise.reject('username taken , try another one')	
			}
        })
	}), 
	
	check('email').not().isEmpty().normalizeEmail().trim()
	.withMessage('Provide a valid email')
    .custom(value => {
        return User.findOne({'email' : value}).then(user => {
            if (user ) {
                return Promise.reject('E-mail already in use')	
			}
        })
	}),	
	check('password').isLength({min : 8 }).trim()
    .withMessage('Password must be 8 characters and above') , 
	check('mobile').isLength({min : 11} , {max : 11}).trim()
	.withMessage('mobile is invalid').matches(/\d+/)
	.withMessage('mobile must be all digits'), 
	
	check('gender').matches(/(Male)|(Female)|(Others)/).withMessage('Invalid') , 
	sanitizeBody('*').escape() , 
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
	user.save((err , user) => {
		if ( err ) {
			res.status(500).send("Something bad happen , please try again") 
		}else {
		    res.send(`${user.fullName} was created successfully `)
		}
		if (res.status == 400) {
			res.send("Error occured while saving document")
		}
	})
}]
//! authenticate a user 
exports.check_user = (req , res , next ) => {
	res.send("Authentication of user is yet to be implemented")
}
/** 
  * Display individual user by querying the database against the user id 
  * Sanitize the item id before using it for querying the collection
  * Check if the item id is valid and exist 
  * Handle error gracefully 
  *@param [String] parametised url 
  *@return [Object] Entire fields describing the user 
**/ 
exports.user = (req , res , next) => {
	User.findById(req.params.id , function(err , user){
		try {
			if (err) {
			    res.status(400).send('Error occured on this request . Try again') 
			}
		    if ( !user ) {
				throw {
					status : 400 , 
					message : "User not found"
				}
		    }else {
		        res.json(user) 
		   }
		}catch(error) {
            res.status(error.status).send(error.message) 
		}			
    })
}
/** 
  * Update each user .
  * The option new must be set to true in order to return a new document that 
  * will have the fields updated
**/
exports.update_user = (req , res , next ) => {
	let userId = req.params.id 
	User.findByIdAndUpdate(userId   , {
		mobile : req.body.mobile , 
		password: req.body.password
	} ,  {new : true } , (err , user) => {
	    try {
			if (err) {
			    res.status(400).send('Error occured on this request . Try again') 
			}
		    if ( !user ) {
				throw {
					status : 400 , 
					message : "User not found"
				}
		    }else {
		        res.send(`Hello , ${user.fullName} your account is now updated`) 
		   }
		}catch(error) {
            res.status(error.status).send(error.message) 
		}
	})
}
/** 
  * To remove a user , we need to first of all remove every items created by the user 
  * Then we can remove the user after deleting the items created by the user 
**/ 
//! Delete a user
exports.delete_user = (req , res , next) => {
	User.find({'created_by' : req.params.id} , function(err , items) {
		if (err) {
			return next(err) 
		}
		Item.deleteMany({'created_by' : req.params.id} , function(err) {
			if (err) {
				res.status(400).send('Error while handling request') 
			}
			User.findByIdAndRemove(req.params.id , function(err) { //!source of error since user is not identified yet
				if (err) {
					res.status(400).send('Error while handling request') 
				}else {
				    res.send('User was deleted successfully') 
				}
			})
		})
	})
}
/** 
  *@return [Object] Array of all users created transmitted in json format  
*/ 
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
