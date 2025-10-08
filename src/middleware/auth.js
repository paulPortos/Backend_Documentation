
const jwt = require('jsonwebtoken');
const User = require('../models/UsersModel');

/**

/**
 * JWT-BASED AUTHENTICATION MIDDLEWARE
 *
 * This checks if the user is logged in by looking for a JWT token in the Authorization header.
 * If the user is logged in and token is valid, it loads their info and attaches it to req.user.
 * If not, it blocks access and asks them to log in.
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header (format: "Bearer <token>")
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided or invalid format. Please log in first.'
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided. Please log in first.'
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find the user in the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Please log in again.'
      });
    }

    // Check if user email is verified
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        message: 'Email not verified. Please check your email and verify your account.'
      });
    }

    // Attach user info to the request for later use
    req.user = user;
    next();
  } catch (error) {
    // Try to find user and set as inactive if token is invalid/expired
    try {
      const authHeader = req.header('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const decoded = jwt.decode(token); // Decode without verification to get userId
        if (decoded && decoded.userId) {
          const user = await User.findById(decoded.userId);
          if (user && user.isActive) {
            user.isActive = false;
            await user.save();
          }
        }
      }
    } catch (updateError) {
      // Silently handle any errors in updating user status
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Server error during authentication.'
      });
    }
  }
};

/**

/**
 * AUTHORIZATION MIDDLEWARE - Checks if the user has the right type (admin/rentor)
 */
const authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please log in first.'
      });
    }
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This feature requires ${userTypes.join(' or ')} privileges.`
      });
    }
    next();
  };
};

/**
 * EXPORT THE FUNCTIONS
 */
module.exports = { authenticate, authorize };