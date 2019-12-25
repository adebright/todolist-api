'use strict' 
/**
  *Module dependencies 
**/  
const mongoose = require('mongoose') 
const Schema   = mongoose.Schema 
/**
 * A schema describes how documents in a model(collection) should be created
 * Schema is a constructor and to create a schema object you need to use 
 * the new key word 
 * @key [String] name of the item 
 * @key [String] status of the item 
 * @key [Date ]  date when the item was created 
 * @key [ObjectId ] ref key to the who created an item 
**/

const ItemSchema = new Schema({
	name : {
		type : String , 
		required : true , 
		minLength : [3 , 'Length too short'] , 
		maxLength : [10 , 'Length too long']
	} , 
	date_created : {
		type : Date , 
		default : Date.now()
	} , 
	status : {
		type : String , 
		enum : ["Pending" , "Completed" , "Ongoing"] ,  
		default : "Pending"
	} , 
	created_by : {
		type : Schema.Types.ObjectId , 
		ref  : 'User'
	}
})
/** 
 *  A virtual is a field that will be part of a model but is not saved
 *  to the database.
 *  You can use the get() method and set() method on a virtual 
 *  To get the url of an item  , we need a url virtual 
 *  @param [String] url for an item 
 *  @return [String] parametise url for the user and the item 
 */

ItemSchema.virtual('url').get(function() {
	return '/user/' + this.created_by + '/item/' + this._id 
})
/** 
  * A method can be attached to a schema
  * describe() method will work on any document created using this schema 
  * @param [null] takes no argument 
  * @return [String] description of the document 
  */
  
ItemSchema.method.describe = function() {
	return `This was created by ${this.created_by} `
}
/**
 * A model is an instance of mongoose.model class 
 * The two arguments necessary to create a model are : model name , and Schema 
 * We are creating an Item model using the ItemSchema 
*/
 
module.exports = mongoose.model('Item' , ItemSchema)
