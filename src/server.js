/**
 * START THE APP (Plain English)
 *
 * This file turns the app on:
 * - connects to the database
 * - starts listening for requests
 * - handles shutdowns and unexpected errors in a friendly way
 */
const app = require('./app');
const connectDB = require('./configs/database');

/**
 * SERVER STARTUP FILE - The Main Engine
 * 
 * This is like the ignition key for your car. When you run this file,
 * it starts up your entire web application and gets everything ready
 * to handle requests from users.
 * 
 * Think of it as the "power button" for your app.
 */

// Load our secret settings from the .env file (like passwords and configuration)
require('dotenv').config();

// Get the port number from our settings, or use 5000 if none is specified
const PORT = process.env.PORT || 5000;

/**
 * START SERVER FUNCTION - The Launch Sequence
 * 
 * This function does all the startup tasks needed to get our app running:
 * 1. Connect to the database
 * 2. Start listening for incoming requests
 * 3. Set up error handling
 */
const startServer = async () => {
  try {
    // Step 1: Connect to our MongoDB database
    await connectDB();
    console.log('✅ Database connection established successfully!');

    // Step 2: Start our web server and begin listening for requests
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is now running on port ${PORT}`);
      console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(``);
      console.log(`🔗 You can now access your app at:`);
      console.log(`   📊 Health check: http://localhost:${PORT}/health`);
      console.log(`   📚 API documentation: http://localhost:${PORT}/api`);
      console.log(`   🌐 Main app: http://localhost:${PORT}`);
      console.log(``);
      console.log(`💡 Press Ctrl+C to stop the server`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err, promise) => {
      console.error('Unhandled Promise Rejection:', err.message);
      // Close server & exit process
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err.message);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
