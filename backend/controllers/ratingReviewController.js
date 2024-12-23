const RatingReviews = require('../models/ratingReviewsModel');
const Book = require('../models/bookModel');
const calculateAndUpdateAverageRating = require('./../services/bookService');
// Add a new rating and review

const addRatingReview = async (req, res) => {
    try {
        console.log(`Inside addRatingReview controller:${bookId},${userId},${rating},${reviewText}`)
        const { bookId, userId, rating, reviewText } = req.body;

        // Add a new rating
        const newRating = await RatingReviews.create({
            bookId,
            userId,
            rating,
            reviewText,
        });

        // Recalculate the average rating
        const averageRating = await calculateAndUpdateAverageRating(bookId);

        res.status(201).json({
            message: 'Rating added successfully',
            newRating,
            averageRating,
        });
    } catch (error) {
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

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const review = await RatingReviews.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Review not found' });

        // Remove review ID from the associated book
        const book = await Book.findById(review.bookId);
        if (book) {
            book.RatingsAndReviews = book.RatingsAndReviews.filter(
                (id) => id.toString() !== review._id.toString()
            );

            // Recalculate average rating
            if (book.RatingsAndReviews.length > 0) {
                const allReviews = await RatingReviews.find({ bookId: book._id });
                book.averageRating =
                    allReviews.reduce((sum, r) => sum + r.rating, 0) / book.RatingsAndReviews.length;
            } else {
                book.averageRating = 0;
            }

            await book.save();
        }

        await review.remove();
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


module.exports = { addRatingReview, getReviewsByBook, deleteReview , updateReview};
