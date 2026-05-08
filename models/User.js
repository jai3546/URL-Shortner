// models/User.js

// Import the mongoose library
const mongoose = require('mongoose');

// Define the schema for the User model.
const userSchema = new mongoose.Schema({
  // 'name' field for the user's name.
  name: {
    type: String,
    required: [true, 'Please provide a name'], // A name is mandatory. Custom error message.
  },

  // 'email' field for the user's email address.
  email: {
    type: String,
    required: [true, 'Please provide an email'], // An email is mandatory.
    unique: true, // This ensures that no two users can register with the same email.
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email address'
    ] // A regular expression to validate the email format.
  },

  // 'password' field for the user's password.
  password: {
    type: String,
    required: [true, 'Please provide a password'], // A password is mandatory.
    minlength: 6, // Passwords should be at least 6 characters long.
    select: false, // This ensures the password is not sent back in query results by default.
  },
}, {
  // As a second argument to the Schema constructor, we can add options.
  // 'timestamps: true' tells Mongoose to automatically add two fields to our schema:
  // - createdAt: A date representing when the document was created.
  // - updatedAt: A date representing when the document was last updated.
  timestamps: true,
});

// IMPORTANT SECURITY NOTE:
// We will hash the password before saving it to the database.
// Storing plain-text passwords is a major security vulnerability.
// This logic will be added in our user controller in a later step (Step 5).

// Export the Mongoose model, making it available for use in other files.
// Mongoose will create a collection named 'users' (plural, lowercase) based on the 'User' model name.
module.exports = mongoose.model('User', userSchema);