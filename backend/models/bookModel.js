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
            data: {
                type: Buffer, // Stores the image as binary data
                required: true, // This should be part of the field object
            },
            contentType: {
                type: String, // Stores the MIME type of the image
                required: true, // This should be part of the field object
            },
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
