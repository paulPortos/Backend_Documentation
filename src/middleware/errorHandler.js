/**
 * ERROR HANDLING MIDDLEWARE - The Problem Solver
 * 
 * Think of this like a helpful customer service representative. When something
 * goes wrong in our app, instead of showing scary technical errors to users,
 * this translates them into friendly, understandable messages.
 * 
 * It's like having someone who speaks both "computer language" and "human language"
 * to help explain what went wrong and how to fix it.
 */

/**
 * MAIN ERROR HANDLER
 * 
 * This catches all errors that happen anywhere in our app and turns them
 * into nice, user-friendly messages. It's like a safety net that catches
 * problems before they scare users.
 */
const errorHandler = (err, req, res, next) => {
  // Make a copy of the error so we can modify it
  let error = { ...err };
  error.message = err.message;

  // Log the error for developers to see (but users won't see this)
  console.error('Error happened:', err);

  // Handle different types of common errors with user-friendly messages

  // 1. Invalid ID format (like trying to find a note with a malformed ID)
  if (err.name === 'CastError') {
    const message = 'Invalid ID format. Please check the ID and try again.';
    error = { message, statusCode: 400 };
  }

  // 2. Duplicate data (like trying to register with an email that already exists)
  if (err.code === 11000) {
    const message = 'This information already exists. Please try with different details.';
    error = { message, statusCode: 400 };
  }

  // 3. Validation errors (like missing required fields or data that's too long)
  if (err.name === 'ValidationError') {
    // Collect all validation error messages and combine them into one friendly message
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // Send back a user-friendly error response
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Something went wrong on our end. Please try again.',
    // In development mode, also show the technical details for debugging
    ...(process.env.NODE_ENV === 'development' && { 
      technicalDetails: err.stack 
    })
  });
};

/**
 * NOT FOUND HANDLER - The "Page Doesn't Exist" Helper
 * 
 * This runs when someone tries to visit a page or use a feature that doesn't exist.
 * It's like a helpful receptionist who tells you "Sorry, that department doesn't
 * exist, but here's what we do have available."
 */
const notFound = (req, res, next) => {
  const error = new Error(`Sorry, the page '${req.originalUrl}' doesn't exist. Please check the URL and try again.`);
  error.statusCode = 404;
  next(error); // Pass this error to the main error handler above
};

/**
 * EXPORT THE FUNCTIONS
 * 
 * This makes our error handling functions available to other parts of our app.
 */
module.exports = { errorHandler, notFound };