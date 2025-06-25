require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");

const app = express();

/**
 * MongoDB Atlas connection (only once)
 */
if (!mongoose.connection.readyState) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas!'))
    .catch(err => console.error('MongoDB connection error:', err));
}

/**
 * CORS 
 */
app.use(cors({
  origin: ['http://localhost:5173',
    'http://localhost:3000', 'https://path-to-math.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const users = require("./routes/users.route");
app.use("/api/users", users);

const api = require("./routes/api.route");
app.use("/api", api);

//For local run on port 5000
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Express server running locally on port ${PORT}`);
  });
}

// Export for Vercel serverless function
module.exports = app;
