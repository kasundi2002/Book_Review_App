const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/ratingReviewController'); // Path to your controller

// Routes for review actions
router.post('/reviews', reviewController.addRatingReview); // Add a new rating and review
router.get('/reviews/book/:bookId', reviewController.getReviewsByBook); // Get reviews for a specific book
router.get('/reviews/user/:userId', reviewController.getReviewsByUser); // Get reviews by a specific user
router.get('/reviews/:id', reviewController.getReviewById); // Get a specific review by ID
router.delete('/reviews/:id', reviewController.deleteReview); // Delete a specific review
router.put('/reviews/:id', reviewController.updateReview); // Update a specific review

module.exports = router;


// const express = require('express');
// const { addRatingReview, getReviewsByBook, deleteReview , updateReview} = require('../controllers/ratingReviewController');

// const router = express.Router();

// // Routes for ratings and reviews

// // http://localhost:8081/ratingReviews/addRatingReview
// router.post('/addRatingReview', addRatingReview); // Add a new rating and review

// // http://localhost:8081/ratingReviews/getReviews/:bookId
// router.get('getReviews/:bookId', getReviewsByBook); // Get all reviews for a specific book

// // http://localhost:8081/ratingReviews/updateReviews/:id
// router.put('updateReviews/:id', updateReview); // update

// // http://localhost:8081/ratingReviews/deleteReview/:id
// router.delete('/deleteReview/:id', deleteReview); // Delete a review by ID

// module.exports = router;
