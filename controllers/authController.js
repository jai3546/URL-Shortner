// controllers/authController.js

// Import the User model
const User = require('../models/User');
// Import bcryptjs for password hashing
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    // 1. Get user data from request body
    const { name, email, password } = req.body;

    // 2. Basic Validation: Check if all fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
    }

    // 3. Check if user already exists
    // We search for a user with the same email address.
    const existingUser = await User.findOne({ email });

    // If a user with this email is found, we return an error.
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'A user with this email already exists' });
    }

    // 4. Hash the password
    // Generate a 'salt' - a random string to add to the password before hashing.
    // This ensures that two identical passwords will have different hashes.
    // The number 10 represents the 'salt rounds' - how much processing power is used.
    // Higher is more secure but slower. 10 is a good standard.
    const salt = await bcrypt.genSalt(10);
    
    // Now, hash the user's password using the generated salt.
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create and save the new user to the database
    // We create a new user instance, but crucially, we store the 'hashedPassword',
    // not the original plain-text password.
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    
    // 6. Send a success response
    // We send a 201 'Created' status code.
    // It's a best practice to not send the password back, even the hashed one.
    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    // Handle any other server-side errors
    console.error('Registration Error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    // 1. Get user credentials from the request body
    const { email, password } = req.body;

    // 2. Basic Validation: Check if email and password were provided
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide an email and password' });
    }

    // 3. Find the user by their email address
    // The .select('+password') is crucial. By default, our User model does not
    // include the password field in queries. We need to explicitly ask for it here
    // so we can use it for comparison.
    const user = await User.findOne({ email }).select('+password');

    // 4. Check if a user was found AND if the password matches
    // We use bcrypt's .compare() method. It hashes the plain-text password from the
    // request and compares it to the stored hash from the database.
    // It's crucial to check for the user's existence first to avoid errors.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      // Security Best Practice: Send a generic error message for both "user not found"
      // and "incorrect password". This prevents "user enumeration" attacks.
      return res.status(400).json({ success: false, error: 'Invalid credentials' });
    }

    // If credentials are correct, create the JWT
    // 1. Define the Payload: This is the data we want to store in the token.
    // We are storing the user's unique MongoDB ID.
    const payload = {
      user: {
        id: user._id,
      },
    };

    // 2. Sign the Token: We use the .sign() method from the jwt library.
    // It takes the payload, our secret key from the .env file, and an options object.
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', // The token will be valid for 1 hour.
    });

    // 3. Send the Token to the Client
    // We send a 200 OK status with the success flag and the generated token.
    // The client will need to store this token to use for future protected requests.
    res.status(200).json({
      success: true,
      token: token,
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};