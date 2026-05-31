// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic Validation
    if (!name || !email || !password) {
      res.status(400); // Set status for middleware
      throw new Error('Please provide name, email, and password');
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('A user with this email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    
    // Send success response
    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });

  } catch (err) {
    // Pass the error to our centralized error handler middleware
    next(err);
  }
};

/**
 * @desc    Authenticate a user and get a token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Basic Validation
    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide an email and password');
    }

    // Find the user by email
    const user = await User.findOne({ email }).select('+password');

    // Security Check: User existence and password verification
    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401); // 401 Unauthorized is more accurate than 400 for bad creds
      throw new Error('Invalid credentials');
    }

    // Define Payload matching your local state design
    const payload = {
      user: {
        id: user._id,
      },
    };

    // Sign the Token (Using your project's payload architecture)
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h', 
    });

    // Send the Token to the Client
    res.status(200).json({
      success: true,
      token: token,
    });

  } catch (err) {
    // Clean and simple catch block redirects to central handler
    next(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
};