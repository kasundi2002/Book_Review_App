const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  // Remove the 'Bearer ' prefix if it's there
  const tokenWithoutBearer = token.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

    // Find the user by ID stored in the token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user info to the request
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authenticateUser;
