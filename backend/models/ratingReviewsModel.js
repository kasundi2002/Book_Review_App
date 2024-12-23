const mongoose = require('mongoose');

const ratingReviewModel = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    reviewText: {
        type: String,
        trim: true,
        required: false, // Review text is optional
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('RatingReviews', ratingReviewModel);
