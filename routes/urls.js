// routes/urls.js

// Import the Express framework
const express = require('express');

// Import our newly flexible auth middleware
const auth = require('../middleware/auth');
// Import the controller function we just created
const { shortenUrl } = require('../controllers/urlController');

// Create a new router object
const router = express.Router();

/**
 * @route   POST /api/shorten
 * @desc    Create a new short URL
 * @access  Public
 */
// We now pass the 'shortenUrl' controller function as the handler for this route.
// Express will automatically invoke this function with (req, res) when the route is matched.
//router.post('/shorten', shortenUrl);
router.post('/shorten', auth, shortenUrl);
// Export the router
module.exports = router;