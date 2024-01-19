const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const initializeAdmin = require('./scripts/adminInit');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/User', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('MongoDB connected successfully');
    initializeAdmin(mongoose); // Pass the mongoose instance to initializeAdmin
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
