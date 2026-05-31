const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google's reliable phone book

// Import and configure dotenv to load environment variables from .env file
// This line should be at the very top to ensure variables are available globally
// Import and configure dotenv to load environment variables from .env file
require('dotenv').config();

// Import the connectDB function we created in config/db.js
const connectDB = require('./config/db');

// Import the Express library
const express = require('express');

// Call the function to connect to the database
connectDB();

// Initialize an instance of the Express application
const app = express();

// --- ADD THIS MIDDLEWARE ---
// This is a crucial piece of Express middleware. It parses incoming requests
// with JSON payloads. Without this, you won't be able to access `req.body`.
app.use(express.json());

// Define a simple route for the root URL ('/')
app.get('/', (req, res) => {
  res.send('API is running...');
});

// --- ADD ROUTE HANDLING ---
// Import the URL routes
const urlRoutes = require('./routes/urls');

// Mount the router: Tell the app to use the 'urlRoutes' for any request
// that starts with '/api'.
app.use('/api', urlRoutes);


// --- ADD THIS NEW ROUTE HANDLER ---
// Mount the API routes for authentication
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// --- ADD THIS NEW ROUTE HANDLER ---
// Mount the API routes for fetching user-specific links
const linksRoutes = require('./routes/links');
app.use('/api/links', linksRoutes);

// 2. Mount the index/redirect routes second.
// Any other GET request will be potentially handled by this router.
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Define the port the server will run on.
const PORT = process.env.PORT || 5000;

// Start the server and make it listen for connections on the specified port.
app.listen(PORT, () => console.log(`Server is alive and running on port ${PORT}`));