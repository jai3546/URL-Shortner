// controllers/linksController.js

// Import the Url model to interact with the 'urls' collection in the database.
const Url = require('../models/Url');

/**
 * @desc    Get all links created by the currently logged-in user.
 * @route   GET /api/links/my-links
 * @access  Private
 */
const getMyLinks = async (req, res) => {
  try {
    // 1. Final Authorization Check
    // The 'auth' middleware runs first. If a token is valid, it attaches 'req.user'.
    // If there's no token, 'req.user' will be undefined.
    // We must check for its existence here to ensure only authenticated users proceed.
    if (!req.user) {
      // This is our second layer of security. The route is private, so if no user
      // is attached to the request, we deny access.
      return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    // 2. Fetch the links from the database
    // We use the 'Url.find()' method to get all documents that match the query.
    // The query object '{ user: req.user.id }' tells Mongoose to find all Url
    // documents where the 'user' field is equal to the ID of the logged-in user.
    // The user's ID comes from the JWT payload that our middleware decoded.
    const links = await Url.find({ user: req.user.id }).sort({ date: -1 });

    // 3. Send the response
    // We send back a 200 OK status with the user's links.
    // It's good practice to include the count of the results.
    res.status(200).json({
      success: true,
      count: links.length,
      data: links,
    });

  } catch (err) {
    // Handle any potential server errors
    console.error('Error fetching user links:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

// Export the controller function so it can be used in our routes.
module.exports = {
  getMyLinks,
};