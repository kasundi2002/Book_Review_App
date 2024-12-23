const mongoose = require('mongoose');

const customerModel = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  RatingsAndReviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RatingReviews',
    },
  ],
});

module.exports = mongoose.model('Customer', customerModel);
