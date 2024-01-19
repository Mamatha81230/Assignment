const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: String,
  photo: String,
  approvalStatus: { type: String, default: 'Not Accepted by Admin' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;

