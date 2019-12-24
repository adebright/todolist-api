//! model for users of our application 
const mongoose = require('mongoose') 
const Schema   = mongoose.Schema 
//!Define the schema for every user document within user collections 
const userSchema = new Schema({
	firstName : {type : String ,  required :true } , 
	lastName : {type : String  } , 
	userName : {type : String  } , 
	email : {type : String  } , 
    password : {type : String }  , 
	date_of_birth : {type : Date , default : Date.now()}  , 
	mobile : {type : String } , 
    bio : {type : String , default : "To catch fun" } , 
    gender  : {type : String ,  default : "Male"}			
})  

//!Add a virtual to always return the fullName 
userSchema.virtual('fullName').get(function() {
	return `${this.firstName}  ${this.lastName} `
})
//! Add some virtual to help us get the user 
userSchema.virtual('username').get(function() {
	return this.userName 
})
//! Get the url of a user 
userSchema.virtual('url').get(function() {
	return '/user/' + this._id //! Nothingless , will still try to use the username in accessing the stuff  
})
//!Creating a query helper
userSchema.query.queyryByPassAndEmail = function(mail , pass) {
	return this.where({email :  mail, password : pass})
} 
userSchema.method.birthdayMessage = function() {
	return `Happy birthday ${this.firstName}  ${this.lastName}`
}
//! create the model to export  
module.exports = mongoose.model('User' , userSchema)
