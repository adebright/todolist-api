'use strict' 
/**
  *Module dependencies 
**/
const express = require('express');
const router = express.Router();
const userController = require('../controller/userController') 
const itemController = require('../controller/itemController') 

/** 
 *Setup the routing mechaninsm for the API
 * The router sends a request to an endpoint , and also execute the 
 * controlling function 
*/
router.get('/api/v1.0.0' , userController.index) 
router.get('/api/v1.0.0/user' , userController.users)
router.get('/api/v1.0.0/signup' , userController.create_user)  
router.post('/api/v1.0.0/signup' , userController.create_user)
router.get('/api/v1.0.0/auth' , userController.check_user)  
router.post('/api/v1.0.0/auth' , userController.check_user)  
router.get('/api/v1.0.0/user/:id' , userController.user) 
router.put('/api/v1.0.0/user/:id' , userController.update_user)  
router.delete('/api/v1.0.0/user/:id' , userController.delete_user)  
router.get('/api/v1.0.0/user/:id/item' , itemController.item_list)  
router.post('/api/v1.0.0/user/:id/item' , itemController.create_item) 
router.get('/api/v1.0.0/user/:id/item/:itemID' , itemController.single_item)  
router.put('/api/v1.0.0/user/:id/item/:itemID'  , itemController.update_item )  
router.delete('/api/v1.0.0/user/:id/item/:itemID'  , itemController.delete_item) 

module.exports = router;
