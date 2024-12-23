const RatingReviews = require('../models/ratingReviewsModel');
const Book = require('../models/bookModel');
const calculateAndUpdateAverageRating = require('./../services/bookService');

// Add a new rating and review
const addRatingReview = async (req, res) => {
    try {
        console.log('Request Body:', req.body);

        const { bookId, userId, rating, reviewText } = req.body;

        console.log(`Inside addRatingReview controller: ${bookId}, ${userId}, ${rating}, ${reviewText}`);
        
        // Add a new rating and review
        const newRating = await RatingReviews.create({
            bookId,
            userId,
            rating,
            reviewText,
        });

        // Update the RatingsAndReviews array in the book model
        await Book.findByIdAndUpdate(
            bookId,
            { $push: { RatingsAndReviews: newRating._id } },
            { new: true }
        );

        // Recalculate the average rating
        const averageRating = await calculateAndUpdateAverageRating(bookId);

        res.status(201).json({
            message: 'Rating added successfully',
            newRating,
            averageRating,
        });
    } catch (error) {
        console.error('Error adding rating:', error);
        res.status(500).json({ message: 'Error adding rating', error });
    }
};

// Get all reviews for a specific book
const getReviewsByBook = async (req, res) => {
    try {
        const reviews = await RatingReviews.find({ bookId: req.params.bookId });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all reviews by a specific user
const getReviewsByUser = async (req, res) => {
    try {
        const reviews = await RatingReviews.find({ userId: req.params.userId }).populate('bookId', 'title author'); // Populate book details (optional)
        if (reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user.' });
        }
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a specific review by review ID
const getReviewById = async (req, res) => {
    try {
        const review = await RatingReviews.findById(req.params.id).populate('bookId', 'title author');
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const deletedReview = await RatingReviews.findByIdAndDelete(req.params.id);
        if (!deletedReview) return res.status(404).json({ message: 'Review not found' });
        res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  

// Update a review
const updateReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const reviewId = req.params.id;

        const review = await RatingReviews.findById(reviewId);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        const book = await Book.findById(review.bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // If the rating is being updated, recalculate the average rating
        if (rating) {
            const previousRating = review.rating;
            review.rating = rating;

            // Update the book's average rating
            const allReviews = await RatingReviews.find({ bookId: book._id });
            const totalRatings = allReviews.reduce((sum, r) => sum + (r._id.equals(reviewId) ? rating : r.rating), 0);
            book.averageRating = totalRatings / allReviews.length;

            await book.save();
        }

        // Update the review text if provided
        if (reviewText) {
            review.reviewText = reviewText;
        }

        const updatedReview = await review.save();
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addRatingReview, getReviewsByBook, getReviewsByUser, getReviewById, deleteReview, updateReview };