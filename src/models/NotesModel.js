const mongoose = require('mongoose');

/**
 * NOTES MODEL - This is like a blueprint for how we store notes in our database
 * 
 * Think of this like a template that describes what information each note should have.
 * Every note in our database will follow this exact pattern.
 */
const noteSchema = new mongoose.Schema({
  // The title of the note (like "Shopping List" or "Homework Reminder")
  title: {
    type: String,                                    // This means the title must be text
    required: [true, 'Note title is required'],     // You MUST provide a title - it's mandatory
    trim: true,                                      // Removes extra spaces at the beginning and end
    maxlength: [200, 'Title cannot exceed 200 characters'] // Title can't be longer than 200 letters
  },
  
  // The main content/body of the note (the actual text you want to remember)
  content: {
    type: String,                                    // This must also be text
    required: [true, 'Note content is required'],   // You MUST write something - can't be empty
    trim: true,                                      // Removes extra spaces
    maxlength: [2000, 'Content cannot exceed 2000 characters'] // Can't write more than 2000 letters
  },
  
  // Optional category to organize your notes (like "Work", "Personal", "School")
  category: {
    type: String,                                    // This is text
    trim: true,                                      // Removes extra spaces
    maxlength: [50, 'Category cannot exceed 50 characters'], // Category name can't be too long
    default: 'General'                               // If you don't specify, it defaults to 'General'
  },
  
  // Whether this note is important or not (true = important, false = normal)
  isImportant: {
    type: Boolean,                                   // This is true or false (yes or no)
    default: false                                   // By default, notes are not marked as important
  },
  
  // Which user owns this note (connects the note to a specific person)
  user: {
    type: mongoose.Schema.Types.ObjectId,           // This is a special ID that points to a user
    ref: 'User',                                    // This tells MongoDB this ID belongs to a User
    required: [true, 'User ID is required']        // Every note MUST belong to someone
  }
}, {
  timestamps: true // This automatically adds 'createdAt' and 'updatedAt' dates to every note
});

/**
 * DATABASE INDEXES - These help make searching faster
 * 
 * Think of indexes like the index at the back of a book - they help find things quickly.
 * Without indexes, the database would have to look through EVERY note to find what you want.
 */
noteSchema.index({ user: 1, createdAt: -1 });     // Makes it fast to find a user's notes, newest first
noteSchema.index({ title: 'text', content: 'text' }); // Makes searching through note text really fast

/**
 * AUTO-POPULATE USER INFO
 * 
 * This is like a helper that automatically gets the user's name and email
 * whenever we fetch a note from the database. It's like having a personal
 * assistant that always includes extra helpful information.
 */
noteSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',                                   // Get the user information
    select: 'fullName email userType'              // But only get their name, email, and user type
  });
  next(); // Continue with the database operation
});

/**
 * EXPORT THE MODEL
 * 
 * This creates our actual Note model and makes it available to other parts of our app.
 * Think of it like creating a factory that can make notes following our blueprint.
 */
module.exports = mongoose.model('Note', noteSchema);