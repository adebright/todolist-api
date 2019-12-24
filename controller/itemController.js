'use strict' 
/**
  *Module dependencies 
**/

const Item = require('../model/item')
const User = require('../model/user')
const {check , validationResult } = require('express-validator') 
const {sanitizeBody }  = require('express-validator')
const {sanitizeParam } = require('express-validator') 
/** 
 * An Item is a document that will be tracked by the user 
 * Because the user may create more than one item , the items will be returned as array 
 * To create an Item ; we need to use the Model class which is a subclass of  `Mongoose.model`
 * @Params [Object] req values from API client 
 * @Return [Object] a new document after successful creation
 * Ensure you call the save method on the document after creating an object using the model class
**/
exports.create_item = (req , res , next) => {
	try { 
	    if ( req.params.id ) {
	        const userId = async () => {
				let user = await User.findById(req.params.id)
				const item = await new Item({
		            name : req.body.name , 
		            created_by : user._id
	            })
				item.save((err , success) => {
		            if(err) {
			            res.send('Error')
		            }else {
			            res.send(`${userId}  , your item creation was a success`) 
		            }
	            })
			}
            userId().then(result => res.send("Item added successfully")).catch(err => res.status(500).send(err))			
		}else {
			throw {
				status : 404 ,
				message : "Bad and Improper request"
			}
		}
	}catch(error) {
		res.status(error.status).send(error.message)
	}
}
/** 
  * Display individual items by querying the database against the item id 
  * Sanitize the item id before using it for querying the collection
  * Check if the item id is valid and exist 
  * Handle error gracefully 
  * ###Model.findById(id , callback(err , result) is a mongoose query API for
  * finding documents using mongodb automatically generated id's
  * We will be using the method to query and select single items
  *@param [String] parametised url 
  *@return [Object] Entire fields describing the item 
**/

exports.single_item = (req , res , next ) => {
	const id = req.params.itemID
	if ( res.status == 404 ) {
		res.send('Error 404 : User not found')
	}else if ( res.status == 400 ) {
		res.send("Bad Request from you my boss")
	}
	Item.findById(id , (err , items) => {
		if ( err ) {
			res.status(500).send("Internal Server Error ") 
		}else if (!items ) {
            res.send("No item exist with this id") 
		}else {
			res.json(items) 
		}
	})
}
/** 
  * Query the model and remove the matched document 
**/ 
exports.delete_item = (req , res , next) => {
	Item.findOneAndRemove(req.params.itemID , err => {
		if (err ) {
			res.status(500).send("Internal Server Error")
		}else if (res.status == 404 ) {
			res.send("The item was not found") 
		}else  if (res.status == 400 ) {
			res.send("Bad request")
		}else {
			res.send("Item was deleted successfully")
		}
	})
}
/** 
  * Update each item .
  * The option new must be set to true in order to return a new document that 
  * will have the fields updated
**/
exports.update_item = (req , res , next ) => {
	let itemId = req.params.itemID 
	Item.findByIdAndUpdate(itemId   , {
		name : req.body.name , 
		status : req.body.status
	} ,  {new : true } , (err , item) => {
		if (err) {
			res.status(500).send(itemId)
		}else {
			res.send(req.params.itemID + " " + "Updated")
		}
	})
}
/** 

  *@return [Object] Array of all items created by a user in json format  
**/
//! Read all items 
exports.item_list = (req , res , next) => {
	Item.find({created_by : req.params.id} , (err , items) => {
		if (err ) {
			res.status(500).send("Internal Server Error")
		}
		if (items.length === 0) {
			res.send(`No Items has been created by ${req.params.id}`) 
		}else {
			res.json(items) 
		}
	})
	
} 