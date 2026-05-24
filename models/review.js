const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true
  }
}, { timestamps: true });

reviewSchema.index({ provider: 1 });
reviewSchema.index({ customer: 1 });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;