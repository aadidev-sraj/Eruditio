const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth'); // Import the routes for authentication

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // To parse incoming JSON requests

// Routes
app.use('/api/auth', authRoutes);  // Mount the auth routes

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('Error connecting to MongoDB:', err.message);
  });


// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

