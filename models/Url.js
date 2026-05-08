// models/Url.js

// Import the mongoose library, which provides tools for modeling our application data.
const mongoose = require('mongoose');

// Define the schema for the URL model. A schema is a blueprint that defines the
// structure of documents within a collection.
const urlSchema = new mongoose.Schema({
  // 'urlCode' will store the unique short code generated for each URL.
  // e.g., 'x7h2in'
  urlCode: {
    type: String,
    required: true, // This field must be present for every document.
  },

  // 'longUrl' is the original, full-length URL that the user wants to shorten.
  longUrl: {
    type: String,
    required: true,
  },

  // 'shortUrl' will be the complete, shortened URL that our service provides.
  // e.g., 'http://localhost:5000/x7h2in'
  shortUrl: {
    type: String,
    required: true,
  },

  // 'clicks' will count how many times the short URL has been visited.
  // We set a default value of 0, so it starts counting from zero for every new URL.
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },

  // 'date' stores the timestamp of when the URL was created.
  // The default value is 'Date.now', which automatically sets the current date and time.
  date: {
    type: Date,
    default: Date.now,
  },
 // This field establishes the relationship between a URL and the user who created it.
  user: {
    // We are storing the user's unique MongoDB ID (_id).
    type: mongoose.Schema.Types.ObjectId,
    // The 'ref' property tells Mongoose that this ID refers to a document
    // in the 'User' collection. This is crucial for using Mongoose's 'populate' feature later.
    ref: 'User',
    // This field is not strictly required. This is a design choice that allows us to
    // still support the original functionality where anonymous, non-logged-in users can create short links.
    // If a link is created by a guest, this field will simply be empty.
    required: false,
  },
});

// Create and export the Url model based on the schema
module.exports = mongoose.model('Url', urlSchema);