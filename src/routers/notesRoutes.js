const express = require('express');
const router = express.Router();
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getNotesStats
} = require('../controllers/notesController');
const { authenticate } = require('../middleware/auth');

/**
 * Notes Routes
 * Handle CRUD operations for notes
 * All routes require authentication
 */

// Apply authentication middleware to all routes
router.use(authenticate);

/**
 * @route   GET /api/notes/stats
 * @desc    Get notes statistics for current user
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/stats', getNotesStats);

/**
 * @route   GET /api/notes
 * @desc    Get all notes for current user with pagination and filters
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @query   page, limit, category, isImportant, search
 */
router.get('/', getNotes);

/**
 * @route   POST /api/notes
 * @desc    Create a new note
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { title, content, category, isImportant }
 */
router.post('/', createNote);

/**
 * @route   GET /api/notes/:id
 * @desc    Get single note by ID
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.get('/:id', getNote);

/**
 * @route   PUT /api/notes/:id
 * @desc    Update note by ID
 * @access  Private
 * @headers Authorization: Bearer <token>
 * @body    { title, content, category, isImportant }
 */
router.put('/:id', updateNote);

/**
 * @route   DELETE /api/notes/:id
 * @desc    Delete note by ID
 * @access  Private
 * @headers Authorization: Bearer <token>
 */
router.delete('/:id', deleteNote);

module.exports = router;