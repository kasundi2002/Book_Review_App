const mongoose = require('mongoose');

const bookModel = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        author: {
            type: String,
            required: true,
            trim: true,
        },
        genre: {
            type: String,
            required: true,
            trim: true,
        },
        summary: {
            type: String,
            required: true,
        },
        coverImage: {
            data: Buffer, // Stores the image as binary data
            contentType: String, // Stores the MIME type of the image
            required: true,
        },
        RatingsAndReviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'RatingReviews',
            },
        ],
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Book', bookModel);
