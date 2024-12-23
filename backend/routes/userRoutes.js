const express = require('express');
const router = express.Router();
const { registerUser,loginUser,createUser, getUser, updateUser, deleteUser } = require('../controllers/userController');

router.post('/register', registerUser);

router.post('/login',loginUser )
// Create a new user (regardless of type)
router.post('/createUser', createUser);

// Get user details by ID
router.get('/getUser/:id', getUser);

// Update an existing user by ID
router.put('/updateUser/:id', updateUser);

// Delete a user by ID
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;