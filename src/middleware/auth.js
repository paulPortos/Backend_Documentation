const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel');

/**
 * AUTHENTICATION MIDDLEWARE - The Security Guard
 * 
 * Think of this like a security guard at a building entrance. Before anyone
 * can access protected parts of our app (like creating notes), this guard
 * checks their ID card (login token) to make sure they're allowed in.
 * 
 * If they have a valid token, they get access. If not, they're turned away.
 */
const authenticate = async (req, res, next) => {
  try {
    // Step 1: Look for the login token in the request headers
    const authHeader = req.header('Authorization');
    
    // Check if they provided a token and if it's in the right format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format. Please log in first.'
      });
    }

    // Step 2: Extract the actual token (remove 'Bearer ' from the beginning)
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix (7 characters)
    
    // Step 3: Check if the token is valid and hasn't been tampered with
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Step 4: Find the user in our database using the ID from the token
    const user = await User.findById(decoded.userId);
    
    // If we can't find the user, the token might be fake or the user was deleted
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found. Please log in again.'
      });
    }

    // Step 5: Everything looks good! Add the user info to the request
    // so other parts of our app know who this person is
    req.user = user;
    next(); // Continue to the next function (like creating a note)
    
  } catch (error) {
    // Handle different types of token errors with user-friendly messages
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Your login has expired. Please log in again.'
      });
    }
    
    // If it's some other error, send a generic message
    res.status(500).json({
      success: false,
      message: 'Server error during authentication. Please try again.'
    });
  }
};

/**
 * AUTHORIZATION MIDDLEWARE - The Permission Checker
 * 
 * This is like a VIP bouncer. Even if you have a valid ticket (authentication),
 * this checks if you have the RIGHT TYPE of ticket for special areas.
 * 
 * For example, only 'admin' users might be allowed to delete other people's accounts.
 * 
 * Usage: authorize('admin', 'rentor') - allows both admin and rentor users
 *        authorize('admin') - only allows admin users
 */
const authorize = (...userTypes) => {
  return (req, res, next) => {
    // First, make sure they're logged in (authentication happened first)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in first.'
      });
    }

    // Check if their user type is in the list of allowed types
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This feature requires ${userTypes.join(' or ')} privileges.`
      });
    }

    next(); // They have the right permissions, continue!
  };
};

/**
 * EXPORT THE FUNCTIONS
 * 
 * This makes our security guard functions available to other parts of our app.
 */
module.exports = { authenticate, authorize };