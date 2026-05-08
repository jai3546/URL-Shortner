// routes/auth.js

// Import the Express framework
const express = require('express');

// Import the controller functions
const { registerUser , loginUser } = require('../controllers/authController');

// Create a new router object.
const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerUser);

// --- Add the new route definition below ---

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and get a token
 * @access  Public
 */
// We replace the placeholder function with a reference to our new 'loginUser' controller.
router.post('/login', loginUser);

// Export the router from this module.
module.exports = router;