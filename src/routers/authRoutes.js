const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile
} = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * Authentication Routes
 * Handle user registration, login, and profile management
 */

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 * @body    { fullName, email, password, userType }
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 * @body    { email, password }
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/profile', authenticate, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { fullName, email }
 */
router.put('/profile', authenticate, updateProfile);

module.exports = router;