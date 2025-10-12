const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  listUsers,
  getUserById,
  verifyUserId
} = require('../controllers/adminController');

/**
 * Admin Routes
 * Simple, clear endpoints for admin user management.
 */

// List users with optional filters (unverified email, unverified ID)
// GET /api/admin/users?unverifiedEmail=true&unverifiedId=true
router.get('/users', authenticate, authorize('admin'), listUsers);

// Get specific user details by ID
// GET /api/admin/users/:id
router.get('/users/:id', authenticate, authorize('admin'), getUserById);

// Mark a user's ID as verified (approved)
// PATCH /api/admin/users/:id/verify-id
router.patch('/users/:id/verify-id', authenticate, authorize('admin'), verifyUserId);

module.exports = router;


