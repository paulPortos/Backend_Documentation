const Note = require('../models/NotesModel');

/**
 * @desc    Get all notes for authenticated user
 * @route   GET /api/notes
 * @access  Private
 */
const getNotes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      isImportant,
      search
    } = req.query;

    // Build query
    const query = { user: req.user._id };

    // Add filters
    if (category) query.category = category;
    if (isImportant !== undefined) query.isImportant = isImportant === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get notes with pagination
    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Note.countDocuments(query);

    res.json({
      success: true,
      message: 'Notes retrieved successfully',
      data: {
        notes,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          totalNotes: total,
          hasNextPage: skip + notes.length < total,
          hasPreviousPage: parseInt(page) > 1
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
 * @desc    Get single note by ID
 * @route   GET /api/notes/:id
 * @access  Private
 */
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note retrieved successfully',
      data: {
        note
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
 * @desc    Create new note
 * @route   POST /api/notes
 * @access  Private
 */
const createNote = async (req, res) => {
  try {
    const { title, content, category, isImportant } = req.body;

    const note = await Note.create({
      title,
      content,
      category,
      isImportant,
      user: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: {
        note
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
 * @desc    Update note
 * @route   PUT /api/notes/:id
 * @access  Private
 */
const updateNote = async (req, res) => {
  try {
    const { title, content, category, isImportant } = req.body;

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id
      },
      {
        title,
        content,
        category,
        isImportant
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: {
        note
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
 * @desc    Delete note
 * @route   DELETE /api/notes/:id
 * @access  Private
 */
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.json({
      success: true,
      message: 'Note deleted successfully',
      data: {
        note
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
 * @desc    Get notes statistics for user
 * @route   GET /api/notes/stats
 * @access  Private
 */
const getNotesStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await Note.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          importantNotes: {
            $sum: { $cond: ['$isImportant', 1, 0] }
          },
          categories: { $addToSet: '$category' }
        }
      }
    ]);

    const result = stats.length > 0 ? stats[0] : {
      totalNotes: 0,
      importantNotes: 0,
      categories: []
    };

    res.json({
      success: true,
      message: 'Notes statistics retrieved successfully',
      data: {
        stats: result
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getNotesStats
};