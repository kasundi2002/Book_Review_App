const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors package

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Enable CORS with specific options (apply before defining routes)
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow your frontend origin (localhost:3000)
  credentials: true,  // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// Routes
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const ratingReviewRoutes = require('./routes/ratingsAndReviewsRoutes');
// Define your routes
app.use('/users', userRoutes);
app.use('/book', bookRoutes);
app.use('/ratingReviews', ratingReviewRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));