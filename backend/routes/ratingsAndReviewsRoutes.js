const express = require('express');
const { addRatingReview, getReviewsByBook, deleteReview , updateReview} = require('../controllers/ratingReviewController');

const router = express.Router();

// Routes for ratings and reviews

// http://localhost:8081/ratingReviews/addRatingReview
router.post('/addRatingReview', addRatingReview); // Add a new rating and review

// http://localhost:8081/ratingReviews/getReviews/:bookId
router.get('getReviews/:bookId', getReviewsByBook); // Get all reviews for a specific book

// http://localhost:8081/ratingReviews/updateReviews/:id
router.put('updateReviews/:id', updateReview); // update

// http://localhost:8081/ratingReviews/deleteReview/:id
router.delete('/deleteReview/:id', deleteReview); // Delete a review by ID

module.exports = router;
