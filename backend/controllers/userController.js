const User = require ('../models/userModel');
const Customer = require('../models/customerModel');
const Admin = require('../models/adminModel');

const jwt = require('jsonwebtoken');

//Register User
const registerUser = async (req, res) => {
  console.log('Request received at /register');

  const { name, email, password } = req.body;

  console.log(`name:${name} , email:${email} password:${password}`);

  // Ensure all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required: name, email, password' });
  }

  try {
    // Check if a user with the given email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create a new user with userType set to 'Resident'
    const user = new User({
      name,
      email,
      password,
      userType: 'Customer', // Only residents can register
    });

    // Save the user to the User table
    const newUser = await user.save();

    // Create a new Resident entry
    const customer = new Customer({
      userId: newUser._id,
      address,
    });

    // Save the resident to the Resident table
    await customer.save();

    // Send a success message in the response
    res.status(201).json({
      message: 'You have successfully registered to the system as a resident.',
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Create a new user and corresponding type-specific entry
const createUser = async (req, res) => {
  const { name, email, password, userType} = req.body; 
  const user = new User({ name, email, password, userType });

  try {
    const newUser = await user.save();

    // Based on the userType, create corresponding user type entry
    if (userType === 'Customer') {
      const customer = new Customer({
        userId: newUser._id,
      });
      await customer.save();
    } else if (userType === 'Admin') {
      const admin = new Admin({
        userId: newUser._id,
      });
      await admin.save();
    }
      else {
      return res.status(400).json({ message: 'Invalid user type provided' });
    }

    // Send a success message in the response
    res.status(201).json({
      message: `User successfully created as ${userType}`,
      user: newUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get a single user
const getUser = async (req, res) => {
  try {
    // Extract token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided or invalid format' });
    }

    const token = authHeader.split(' ')[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch the user details from the database
    const user = await User.findById(decoded.id).select('-password'); // Exclude the password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with user details
    res.status(200).json(user); // Send the entire user object
  } catch (error) {
    console.error('Error fetching user details:', error);

    // Handle specific JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

// Update an existing user and the associated user type table
const updateUser = async (req, res) => {
  const { name, email, password, userType, address, routeDetails } = req.body;
  
  try {
    // Update the user in the User collection
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    // Update corresponding user type information
    if (userType === 'Customer') {
      await Customer.findOneAndUpdate({ userId: req.params.id }, { new: true });
    } else if (userType === 'Admin') {
      await Admin.findOneAndUpdate({ userId: req.params.id  }, { new: true });
    } 
    else {
      return res.status(400).json({ message: 'Invalid user type provided' });
    }

    res.json({ message: `${userType} user updated successfully`, user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a user and the associated user type table
const deleteUser = async (req, res) => {
  try {
    // Find the user by ID to determine the userType
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete user from User collection
    await User.findByIdAndDelete(req.params.id);

    // Delete from corresponding user type table
    if (user.userType === 'Customer') {
      await Customer.findOneAndDelete({ userId: req.params.id });
    } else if (user.userType === 'Admin') {
      await Admin.findOneAndDelete({ userId: req.params.id });
    } else {
      return res.status(400).json({ message: 'Invalid user type provided' });
    }

    res.json({ message: `${user.userType} user and corresponding records deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log(`Inside login of userController:${email},${password}`);
  
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    // Check if the password matches
    const isMatch = (password === user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  registerUser,
  loginUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
