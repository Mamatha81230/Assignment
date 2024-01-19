const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Admin = require('../models/admin');
const User = require('../models/user');

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

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Entered Username:', username);
    console.log('Entered Password:', password);

    // Find the admin by username
    const admin = await Admin.findOne({ username });
    console.log('Retrieved Admin:', admin);

    // If admin not found
    if (!admin) {
      console.log('Admin not found');
      return res.json({ success: false, message: 'Admin not found' });
    }

    // Log the stored hash for verification
    console.log('Stored Hash:', admin.password);

    // Verify the password
    if (!(await admin.verifyPassword(password))) {
      // If the verification fails, log the mismatch
      console.log('Password verification failed');
      return res.json({ success: false, message: 'Invalid username or password' });
    }

    // If login is successful, log success
    console.log('Password verification successful');
    res.json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// New route to get admin credentials
router.get('/admin-credentials', async (req, res) => {
  try {
    // Find the admin by username
    const admin = await Admin.findOne({ username: 'admin' });

    // If admin not found
    if (!admin) {
      return res.json({ success: false, message: 'Admin not found' });
    }

    // Return admin username and hashed password (avoid exposing actual passwords)
    res.json({ success: true, username: admin.username, hashedPassword: admin.password });
  } catch (error) {
    console.error('Error fetching admin credentials:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// ... (existing routes)
 //Admin dashboard - Displaying limited user credentials
router.get('/dashboard', async (req, res) => {
  try {
    const users = await User.find().limit(2);
    res.render('admin_dashboard', { users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// User data table - Displaying all users
router.get('/user-table', async (req, res) => {
  try {
    const users = await User.find();
    res.render('user_table', { users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Approval request
router.post('/approve-update/:userId', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: { approvalStatus: 'Pending' } },
      { new: true }
    );
    res.json({ success: true, message: 'Approval request sent', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// Get approval status
router.get('/get-approval-status/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({ success: true, approvalStatus: user.approvalStatus });
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

module.exports = router;
