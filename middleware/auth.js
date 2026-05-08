// middleware/auth.js

// Import the jsonwebtoken library to verify the token
const jwt = require('jsonwebtoken');

/**
 * @desc This middleware function verifies the JWT sent by the client.
 * If the token is valid, it attaches the decoded user payload to the request object.
 * If the token is missing or invalid, it sends a 401 Unauthorized response.
 */
const auth = (req, res, next) => {
  // 1. Get the token from the request header.
  // The 'x-auth-token' header is a common convention for sending tokens.
  const token = req.header('x-auth-token');

  // 2. Check if a token was provided.
  // If not, the user is not authenticated.
  if (!token) {
    // We send a 401 'Unauthorized' status. It's the standard code for when
    // authentication is required but has failed or has not been provided.
   // return res.status(401).json({ success: false, error: 'No token, authorization denied' });
   return next();
  }

  // 3. Verify the token if it exists.
  try {
    // jwt.verify() decodes the token and validates its signature.
    // It takes the token, our secret key, and returns the decoded payload if valid.
    // If the signature is invalid or the token is expired, it will throw an error.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user payload to the request object.
    // The decoded payload contains the 'user' object we added when signing the token
    // (e.g., { user: { id: '...' } }). We attach this to 'req' so that subsequent
    // route handlers can access the logged-in user's information.
    req.user = decoded.user;

    // 5. Pass control to the next middleware or route handler.
    // This is crucial. If we don't call next(), the request will be left hanging.
    next();

  } catch (err) {
    // This block catches errors from jwt.verify() (e.g., invalid token, expired token).
    console.error('Token verification failed:', err.message);
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

// Export the middleware function so we can use it in our route files.
module.exports = auth;