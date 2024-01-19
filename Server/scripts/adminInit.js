const bcrypt = require('bcrypt');
const Admin = require('../models/admin');

const initializeAdmin = async (mongoose) => {
  try {
    // Check if admin account already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });

    if (!existingAdmin) {
      // If admin doesn't exist, create one
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      await Admin.create({ username: 'admin', password: hashedPassword });
      console.log('Admin account initialized successfully.');
    } else {
      console.log('Admin account already exists.');
    }
  } catch (error) {
    console.error('Error initializing admin account:', error);
  } finally {
    // Close the MongoDB connection after initialization
    mongoose.connection.close();
  }
};

// Export the function
module.exports = initializeAdmin;
