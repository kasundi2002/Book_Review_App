const express = require('express');
const { addRatingReview, getReviewsByBook, deleteReview , updateReview} = require('../controllers/ratingReviewController');

const router = express.Router();

// Routes for ratings and reviews
router.post('/addRatingReview/', addRatingReview); // Add a new rating and review
router.get('getReviews/:bookId', getReviewsByBook); // Get all reviews for a specific book
router.put('updateReviews/:id', updateReview); // update
router.delete('/deleteReview/:id', deleteReview); // Delete a review by ID

module.exports = router;
