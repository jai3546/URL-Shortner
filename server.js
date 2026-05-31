const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']); // Use Google's reliable phone book

// Import and configure dotenv to load environment variables from .env file
require('dotenv').config();

// Import the connectDB function we created in config/db.js
const connectDB = require('./config/db');

// Import the Express library
const express = require('express');
const path = require('path'); // <-- Added for production path handling

// Call the function to connect to the database
connectDB();

// Initialize an instance of the Express application
const app = express();

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());

// --- API ROUTE HANDLING ---
// Import and mount the URL routes
const urlRoutes = require('./routes/urls');
app.use('/api', urlRoutes);

// Mount the API routes for authentication
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Mount the API routes for fetching user-specific links
const linksRoutes = require('./routes/links');
app.use('/api/links', linksRoutes);

// Mount the index/redirect routes
const indexRoutes = require('./routes/index');
app.use('/', indexRoutes);

// --- PRODUCTION SERVING HACK (RENDER SINGLE-PLATFORM) ---
// This serves your frontend assets compiled by Vite directly from the client folder
if (process.env.NODE_ENV === 'production') {
  // Serve static assets from Vite's build directory
  app.use(express.static(path.join(__dirname, 'client/dist')));

  // For any client-side routes (like /dashboard or /login), serve index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

// Global Error Handler Middleware
const errorHandler = require('./middleware/errorMiddleware');
app.use(errorHandler);

// Define the port the server will run on.
const PORT = process.env.PORT || 5000;

// Start the server and make it listen for connections on the specified port.
app.listen(PORT, () => console.log(`Server is alive and running on port ${PORT}`));