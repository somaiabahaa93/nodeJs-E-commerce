const mongoose = require("mongoose");

// creating schema
const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    ratings: {
      type: Number,
      min: [1, "the min rating is 1"],
      max: [5, "the max ratings is 5 "],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "review must belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "review must belong to product"],
    },
  },
  { timestamps: true }
);

// mongoose query middleware to make populate
reviewSchema.pre(/^find/, function (next) {
  // eslint-disable-next-line no-unused-expressions
  this.populate({
    path: "user",
    select: "name",
    // eslint-disable-next-line no-sequences
  }),
    next();
});
// creating model
const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
