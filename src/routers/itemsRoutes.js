const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyItems,
  getItemsStats
} = require('../controllers/itemsController');
const { authenticate, authorize } = require('../middleware/auth');

// Ensure storage directory exists
const storageDir = path.join(__dirname, '../../storage/items');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, storageDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-userid-originalname
    const uniqueName = `${Date.now()}-${req.user._id}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

/**
 * Items Routes
 * Handle CRUD operations for rental items
 */

/**
 * @route   GET /api/items/stats
 * @desc    Get items statistics
 * @access  Private (Admin only)
 */
router.get('/stats', authenticate, authorize('admin'), getItemsStats);

/**
 * @route   GET /api/items/my-items
 * @desc    Get current user's items
 * @access  Private
 */
router.get('/my-items', authenticate, getMyItems);

/**
 * @route   POST /api/items
 * @desc    Create new item
 * @access  Private
 * @body    { item_name, description?, category, price, location }
 * @file    picture (required)
 */
router.post('/', authenticate, upload.single('picture'), createItem);

/**
 * @route   GET /api/items
 * @desc    Get all items with filtering and pagination
 * @access  Public
 * @query   page, limit, category, location, minPrice, maxPrice, search, showDisabled
 */
router.get('/', getAllItems);

/**
 * @route   GET /api/items/:id
 * @desc    Get single item by ID
 * @access  Public
 */
router.get('/:id', getItemById);

/**
 * @route   PUT /api/items/:id
 * @desc    Update item (all fields optional)
 * @access  Private (Owner or Admin)
 * @body    { item_name?, description?, category?, price?, location?, disable? }
 * @file    picture? (optional)
 */
router.put('/:id', authenticate, upload.single('picture'), updateItem);

/**
 * @route   DELETE /api/items/:id
 * @desc    Delete item
 * @access  Private (Owner or Admin)
 */
router.delete('/:id', authenticate, deleteItem);

module.exports = router;