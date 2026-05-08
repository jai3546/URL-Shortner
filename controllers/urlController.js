// controllers/urlController.js

// Import the 'valid-url' library to validate the format of the incoming URL.
const validUrl = require('valid-url');
// --- ADD THIS IMPORT ---
// Import the Url model, which gives us access to the database collection.
const Url = require('../models/Url');

/**
 * @desc    This function will be responsible for creating a new short URL.
 * @route   POST /api/shorten
 * @access  Public
 */
const shortenUrl = async (req, res) => {
  // Use object destructuring to get the 'longUrl' property from the request body.
  const { longUrl } = req.body;

  // Log the received URL to the console for testing purposes.
  console.log('Received long URL:', longUrl);

  // Basic validation: Check if longUrl was actually provided in the request.
  if (!longUrl) {
    return res.status(400).json({ success: false, error: 'Please provide a URL' });
  }

  // Use the 'valid-url' library to check if the longUrl is a valid URI.
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ success: false, error: 'Invalid URL format provided' });
  }

  // --- NEW LOGIC STARTS HERE ---

  try {
    // Check if the long URL already exists in our database.
    // The findOne() method returns the first document that matches the query, or null if no match is found.
    // We use 'await' because this is an asynchronous database operation.
    let url = await Url.findOne({ longUrl });

    // If a URL document was found, it means we have already shortened this URL.
    if (url) {
      // Return the existing URL document to the client.
      // We send a 200 OK status because we are successfully providing existing data.
      return res.status(200).json({ success: true, data: url });
    }
    
     // --- NEW CODE STARTS HERE ---

    // Since the URL is new, we generate a unique short code for it.
    // Dynamically import the 'nanoid' package. This is the modern way to
    // import an ES Module into a CommonJS file within an async function.
    const { nanoid } = await import('nanoid');
    
    // Use nanoid to generate a unique string of 7 characters.
    // This will serve as the unique identifier for our short URL.
    const urlCode = nanoid(7);
    
     // Construct the full short URL by combining the base URL from our
    // environment variables with the newly generated unique code.
    // The `process.env.BASE_URL` works because `dotenv.config()` was called in server.js.
    const shortUrl = `${process.env.BASE_URL}/${urlCode}`;

    
    
    // --- START OF NEW LOGIC ---

    // Create an object to hold the data for our new URL document.
    const newUrlData = {
      longUrl,
      shortUrl,
      urlCode,
    };
    
    // Check if the auth middleware added a user to the request object.
    // This is the core of our optional authentication.
    if (req.user) {
      // If a user is logged in, add their ID to the data object.
      // req.user.id comes directly from the decoded JWT payload.
      newUrlData.user = req.user.id;
    }
    
    // Create the new URL document in the database using our data object.
    // If req.user existed, the 'user' field will be populated.
    // If not, the 'user' field will be omitted, and Mongoose won't save it.
    url = await Url.create(newUrlData);

    // --- END OF NEW LOGIC ---

    // Send the response back to the client.
    // A 201 'Created' status code is the most appropriate for a successful POST request that creates a new resource.
    res.status(201).json({ success: true, data: url });
    
    // --- NEW CODE ENDS HERE ---
  } catch (err) {
    // If any error occurs during the database operation, we catch it here.
    console.error('Database error:', err); // Log the actual error for debugging.
    
    // Send a 500 Internal Server Error response. This indicates that something
    // went wrong on our server, not because of a client mistake.
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
  // --- NEW LOGIC ENDS HERE ---
};
/**
 * @desc    Find a URL by its short code and redirect the user.
 * @route   GET /:code
 * @access  Public
 */
const redirectToUrl = async (req, res) => {
  // --- NEW LOGIC STARTS HERE ---
  try {
    // Find the URL document in the database that has the 'urlCode' matching
    // the 'code' parameter from the request URL.
    const url = await Url.findOne({ urlCode: req.params.code });

    // Check if a URL was found for the given code.
    if (url) {

       // If the URL is found, we increment its 'clicks' property by one.
      // This change currently only exists in the server's memory for this request.
      url.clicks++;
      // If a URL is found, for now, we'll just send it back as a success response.
      // The actual redirection and click increment will be handled in the next steps.
      // This is a great way to test that our lookup is working correctly.
      // We now save the updated document back to the database.
      // The .save() method is an instance method and is asynchronous, so we must 'await' it.
      await url.save();
       // Perform the redirect to the original long URL.
      // The res.redirect() method automatically sets the correct HTTP status code
      // (302 Found by default) and the 'Location' header.
      // We are specifying a 301 status for a permanent redirect.
      return res.redirect(301, url.longUrl);
      
    } else {
      // If no URL is found, it means the short link is invalid.
      // We send back a 404 Not Found status with a user-friendly error message.
      return res.status(404).json({ success: false, error: 'No URL found' });
    }
  } catch (err) {
    // If any other error occurs (e.g., a database connection issue), we catch it here.
    console.error('Server error on redirect:', err); // Log the error for debugging.
    
    // Send a 500 Internal Server Error response. This tells the client
    // that something went wrong on our end, not theirs.
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
  // --- NEW LOGIC ENDS HERE ---
};


// --- UPDATE THE EXPORTS OBJECT ---
// We export an object containing both controller functions.
module.exports = {
  shortenUrl,
  redirectToUrl,
};