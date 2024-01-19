const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Add a method to verify the password
adminSchema.methods.verifyPassword = async function (password) {
  console.log('Entered Password:', password);
  console.log('Stored Hash:', this.password);

  try {
    const result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    console.error('Password verification failed');
    throw error;
  }
};




const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
