// config/db.js

// Import the Mongoose library, which is our ODM (Object Data Modeling) for MongoDB.
const mongoose = require('mongoose');

/**
 * Establishes a connection to the MongoDB database.
 * This function uses async/await to handle the asynchronous nature of database connections.
 */
const connectDB = async () => {
  try {
    // Attempt to connect to the MongoDB cluster.
    // mongoose.connect() returns a promise, so we use 'await' to wait for it to resolve.
    // We get the connection string from our environment variables, which we loaded in server.js.
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // If the connection is successful, log a confirmation message to the console.
    // The 'conn.connection.host' property will display the host of the connected database,
    // which is useful for confirming we've connected to the correct place.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If an error occurs during the connection attempt, the 'catch' block will be executed.
    console.error(`Error connecting to MongoDB: ${error.message}`);

    // Exit the Node.js process with a failure code ('1').
    // This is crucial because if the app cannot connect to its database, it cannot function correctly.
    // It's better to stop the application than to let it run in a broken state.
    process.exit(1);
  }
};

// Export the connectDB function so it can be imported and used in other parts of our application,
// specifically in our main server.js file.
module.exports = connectDB;
