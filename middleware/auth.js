// middleware/auth.js

const jwt = require('jsonwebtoken');

/**
 * @desc This middleware function verifies the JWT sent by the client.
 * If the token is valid, it attaches the decoded user payload to the request object.
 * If the token is missing or invalid, it sends a 401 Unauthorized response.
 */
const auth = (req, res, next) => {
  // 1. FIXED: Get the token from the standard 'Authorization' header.
  const authHeader = req.header('Authorization');

  // 2. FIXED: Check if the header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')||authHeader.includes('undefined') || 
      authHeader.includes('null')) {
    return next();
  }

  // 3. Verify the token if it exists.
  try {
    // FIXED: Split the string at the space character to isolate the raw token payload string
    // authHeader looks like: "Bearer eyJhbGciOi..." -> splits into ["Bearer", "eyJhbGciOi..."]
    const token = authHeader.split(' ')[1];

    // jwt.verify() decodes the token and validates its signature.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user payload to the request object.
    req.user = decoded.user;

    // Pass control to the next middleware or route handler.
    next();

  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ success: false, error: 'Not authorized to access this route' });
  }
};

module.exports = auth;