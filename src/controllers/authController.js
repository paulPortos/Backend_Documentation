const User = require('../models/UsersModel');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('./userVerificationController');

/**
 * GENERATE JWT TOKEN
 * Creates a JWT token for user authentication
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create user (starts as unverified)
    const user = await User.create({
      fullName,
      email,
      password,
      userType,
      is_verified: false
    });

    // Send verification email
    const emailSent = await sendVerificationEmail(user);
    
    if (!emailSent) {
      // If email fails, still create user but inform about email issue
      return res.status(201).json({
        success: true,
        message: 'User registered successfully, but verification email could not be sent. Please contact support.',
        data: {
          user: {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            userType: user.userType,
            is_verified: user.is_verified
          }
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification link.',
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
          is_verified: user.is_verified
        }
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in. Check your inbox for verification link.'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Set user as active when they login
    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          userType: user.userType,
          is_verified: user.is_verified,
          isActive: user.isActive
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
/**
 * @desc    Logout user (JWT-based - client-side logout)
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = async (req, res) => {
  try {
    // With JWT, logout is mainly handled on the client side by removing the token
    // Update the user's last activity and set as inactive
    const user = await User.findById(req.user._id);
    if (user) {
      user.isActive = false;
      await user.updateLastActivity();
    }
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully. Please remove the token from your client.' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

module.exports = {
  register,
  login,
  logout
};