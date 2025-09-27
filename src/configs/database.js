const mongoose = require('mongoose');

/**
 * DATABASE CONNECTION - The Bridge to Our Data
 * 
 * Think of this like connecting your app to a filing cabinet where all your
 * data is stored. MongoDB is our filing cabinet, and this function creates
 * the connection so our app can read and write data.
 * 
 * This is like plugging in a cable between your app and the database.
 */
const connectDB = async () => {
  try {
    // Try to connect to our MongoDB database using the address from our .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    // If successful, let us know we're connected and to which database
    console.log(`✅ Successfully connected to MongoDB database at: ${conn.connection.host}`);
    
  } catch (error) {
    // If something goes wrong, tell us what happened and stop the app
    console.error('❌ Failed to connect to database:', error.message);
    console.error('💡 Make sure MongoDB is running and your connection string is correct');
    process.exit(1); // Stop the app since we can't work without a database
  }
};

/**
 * EXPORT THE FUNCTION
 * 
 * This makes our database connection function available to other parts of our app.
 */
module.exports = connectDB;