const mongoose = require('mongoose'); // Import mongoose
const RatingReviews = require('./../models/ratingReviewsModel');
const Book = require('./../models/bookModel');

// Function to calculate and update the average rating for a book
const calculateAndUpdateAverageRating = async (bookId) => {
    try {
        // Step 1: Aggregate ratings for the specified book
        const result = await RatingReviews.aggregate([
            {
                $match: { bookId: new mongoose.Types.ObjectId(bookId) }, // Use 'new' keyword
            },
            {
                $group: {
                    _id: '$bookId',
                    averageRating: { $avg: '$rating' }, // Calculate the average rating
                },
            },
        ]);

        // Extract the average rating from the aggregation result
        const averageRating = result.length > 0 ? result[0].averageRating : 0;

        // Step 2: Update the average rating in the Book model
        await Book.findByIdAndUpdate(
            bookId,
            { averageRating },
            { new: true } // Return the updated document
        );

        console.log(`Average rating updated for book ${bookId}: ${averageRating}`);
        return averageRating;
    } catch (error) {
        console.error('Error calculating average rating:', error);
        throw error;
    }
};

module.exports = calculateAndUpdateAverageRating;
