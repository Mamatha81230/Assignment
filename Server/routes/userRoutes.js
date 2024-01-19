const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
router.use(bodyParser.json());
// Middleware to connect to MongoDB
router.use(async (req, res, next) => {
  try {
    // Check if the MongoDB connection is already established
    if (mongoose.connection.readyState !== 1) {
      // Connect to MongoDB if not already connected
      await mongoose.connect('mongodb://localhost:27017/User', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('MongoDB connected successfully');
    }

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    console.log('Request Body:', req.body);

    const user = await User.findOne({ username: req.body.username });

    console.log('Found User:', user);

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.json({ success: true, message: 'Login successful', user });
      } else {
        console.log('Password does not match');
        res.json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      console.log('User not found');
      res.json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});



// Profile update
router.post('/update-profile/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { /* Update user data based on req.body */ } },
      { new: true }
    );

    // Forward the update request to the admin (you can use a notification system or other means)
    // Example: Send an email or push notification to the admin

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Middleware to disconnect from MongoDB after route handlers
router.use((req, res, next) => {
  // Close the MongoDB connection after route handlers
  mongoose.connection.close();
  console.log('MongoDB connection closed');
});

// Add other user-related routes as needed

module.exports = router;
