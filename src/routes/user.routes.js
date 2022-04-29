const express = require('express');
const { validateUser } = require('../controllers/user.controller');
const router = express.Router();
const userController = require('../controllers/user.controller')

//Standard response
router.get('/', userController.standardResponse);

//UC-201 - Register as a new user
router.post('/api/user', userController.validateUser, userController.addUser);
  
//UC-202 - Get all users
router.get('/api/user', userController.getAllUsers);

//UC-203 - Request personal user profile
router.get('/api/user/profile', userController.getPersonalProfile);

//UC-204 - Get single user by ID
router.get('/api/user/:userId', userController.getUserById);

//UC-205 - Update a single user
router.put('/api/user/:userId', userController.validateUser, userController.updateUser);

//UC-206 - Delete a user
router.delete('/api/user/:userId', userController.deleteUser);

module.exports = router;