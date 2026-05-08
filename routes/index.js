// routes/index.js

// Import the Express framework to create a router.
const express = require('express');

// Create a new router object.
const router = express.Router();

// --- ADD THE NEW ROUTE DEFINITION BELOW ---

/**
 * @route   GET /:code
 * @desc    Redirect to the long/original URL
 * @access  Public
 */
// router.get('/:code', (req, res) => {
//   // For now, we will just confirm that we can capture the code.
//   // We use object destructuring to get the 'code' parameter from req.params.
//   const { code } = req.params;

//   // Send a JSON response for testing to show the captured code.
//   // The full redirect logic will be built in the controller in the next task.
//   res.status(200).json({
//     success: true,
//     message: 'Redirect route is working!',
//     capturedCode: code,
//   });
// });
// Instead of an inline function, we now pass a reference to our controller function.
// Express will automatically call redirectToUrl(req, res) when this route is matched.
const { redirectToUrl } = require('../controllers/urlController');
router.get('/:code', redirectToUrl);
// Export the router so it can be mounted in our main server.js file.
module.exports = router;