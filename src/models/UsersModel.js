const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * USERS MODEL - This is like a blueprint for how we store user accounts in our database
 * 
 * Think of this like a form that everyone has to fill out when they create an account.
 * It defines what information we collect about each user and how we keep it safe.
 */
const userSchema = new mongoose.Schema({
  // The user's full name (like "John Doe" or "Sarah Smith")
  fullName: {
    type: String,                                    // This must be text
    required: [true, 'Full name is required'],      // You MUST provide a name - it's mandatory
    trim: true,                                      // Removes extra spaces at beginning and end
    maxlength: [100, 'Full name cannot exceed 100 characters'] // Name can't be longer than 100 letters
  }, 
  
  // The user's email address (used for login and contact)
  email: {
    type: String,                                    // This must be text
    required: [true, 'Email is required'],          // You MUST provide an email - it's mandatory
    unique: true,                                    // No two users can have the same email
    lowercase: true,                                 // Converts email to lowercase (john@EMAIL.com becomes john@email.com)
    trim: true,                                      // Removes extra spaces
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, // This is a pattern that checks if email looks valid
      'Please enter a valid email address'           // Error message if email format is wrong
    ]
  },
  
  // The user's password (this will be encrypted/scrambled for safety)
  password: {
    type: String,                                    // This must be text
    required: [true, 'Password is required'],       // You MUST provide a password
    minlength: [8, 'Password must be at least 8 characters long'] // Password must be at least 8 letters/numbers
  },
  
  // What type of user they are (determines what they can do in the app)
  userType: {
    type: String,                                    // This must be text
    enum: ['admin', 'staff', 'rentor'],                       // Can ONLY be one of these two values
    required: [true, 'User type is required'],      // You MUST specify a user type
    default: 'rentor'                                // If you don't specify, it defaults to 'rentor'
  },

  // Whether the user has verified their email address
  is_verified: {
    type: Boolean,                                   // This must be true or false
    default: false                                   // New users start as unverified
  },

  // The last time the user logged out (for tracking activity)
  last_activity: {
    type: Date,                                      // This will store the date and time
    default: null                                    // Starts as null, updated on logout
  }
  }, {
  timestamps: true // This automatically adds 'createdAt' and 'updatedAt' dates to every user
});

/**
 * PASSWORD ENCRYPTION - This scrambles passwords before saving them
 * 
 * This is SUPER important for security! When someone creates an account,
 * we don't save their actual password. Instead, we scramble it so that
 * even if someone breaks into our database, they can't see real passwords.
 * 
 * This runs automatically BEFORE saving any user to the database.
 */
userSchema.pre('save', async function(next) {
  // Only scramble the password if it's new or has been changed
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a "salt" (random data) to make the encryption extra strong
    const salt = await bcrypt.genSalt(12);
    // Scramble the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Continue with saving the user
  } catch (error) {
    next(error); // If something goes wrong, report the error
  }
});

/**
 * PASSWORD CHECKING FUNCTION
 * 
 * This is a special function that checks if a password is correct.
 * When someone tries to log in, we use this to compare what they typed
 * with the scrambled password we have stored.
 * 
 * Usage: user.matchPassword("password123") returns true if correct, false if wrong
 */
userSchema.methods.matchPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * HIDE PASSWORD FROM RESPONSES
 * 
 * This makes sure that when we send user information back to the app,
 * we never include the password. This is for extra security - passwords
 * should never be visible, even in scrambled form.
 */
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();           // Convert user data to plain object
  delete userObject.password;                   // Remove the password field
  return userObject;                            // Return user data without password
};

/**
 * EXPORT THE MODEL
 * 
 * This creates our actual User model and makes it available to other parts of our app.
 * Think of it like creating a factory that can make user accounts following our blueprint.
 */

/**
 * UPDATE LAST ACTIVITY METHOD
 *
 * This function can be called when the user logs out to record the time.
 * Usage: await user.updateLastActivity();
 */
userSchema.methods.updateLastActivity = async function() {
  this.last_activity = new Date();
  await this.save();
};

module.exports = mongoose.model('User', userSchema);