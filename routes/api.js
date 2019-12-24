const express = require('express');
const router = express.Router();
//! Get the controllers for the application 
const userController = require('../controller/userController') 
const itemController = require('../controller/itemController') 
/*! Setup the routing mechaninsm for the API*/
//! A router will take a route and a callback to handle request to that route


router.get('/api/v1.0.0' , userController.index) //! Get request to the api home page 

router.get('/api/v1.0.0/user' , userController.users) //! Get request to fetch all users 

router.get('/api/v1.0.0/signup' , userController.create_user) //!get request to create a single user 
router.post('/api/v1.0.0/signup' , userController.create_user) //!post request to create a single user 

router.get('/api/v1.0.0/auth' , userController.check_user) //!get request to authenticate a user 
router.post('/api/v1.0.0/auth' , userController.check_user) //!post request to authenticate a user 

router.get('/api/v1.0.0/user/:id' , userController.user) //!get request to display a single user 

router.put('/api/v1.0.0/user/:id' , userController.update_user) //!request to update a single user 

router.delete('/api/v1.0.0/user/:id' , userController.delete_user) //!delete a user 

router.get('/api/v1.0.0/user/:id/item' , itemController.item_list) //!get all items by a user 
 
router.post('/api/v1.0.0/user/:id/item' , itemController.create_item) //! create an item 

router.get('/api/v1.0.0/user/:id/item/:itemID' , itemController.single_item) //! get a single item 

router.put('/api/v1.0.0/user/:id/item/:itemID'  , itemController.update_item ) //! updates an item 

router.delete('/api/v1.0.0/user/:id/item/:itemID'  , itemController.delete_item) //! deletes an item 

module.exports = router;
