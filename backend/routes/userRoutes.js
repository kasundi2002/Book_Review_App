const express = require('express');
const router = express.Router();
const { registerUser,loginUser,createUser, getUser, updateUser, deleteUser } = require('../controllers/userController');

// http://localhost:8081/users/register
router.post('/register', registerUser);

// http://localhost:8081/users/login
router.post('/login',loginUser )
// Create a new user (regardless of type)
router.post('/createUser', createUser);

// Get user details by ID
// http://localhost:8081/users/getUser
router.get('/getUser', getUser);

// Update an existing user by ID
//http://localhost:8081/users/updateUser/${id}
router.put('/updateUser/:id', updateUser);

// Delete a user by ID
// http://localhost:8081/users/deleteUser/${id}
router.delete('/deleteUser/:id', deleteUser);

module.exports = router;