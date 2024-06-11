const mongoose = require("mongoose");
const ProductModel = require("./productModel");

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

// make avg and sum for product ratings
reviewSchema.statics.calAvgRatingAndQuantity = async function (productId) {
  const results = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "product",
        avgRating: { $avg: "$ratings" },
        ratingQ: { $sum: 1 },
      },
    },
  ]);

  if (results.length > 0) {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: results[0].avgRating,
      ratingQuantitiy: results[0].ratingQ,
    });
    // console.log("ressss", results);
  } else {
    await ProductModel.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingQuantitiy: 0,
    });
    // console.log("nooooo", results);
  }
};

// fire the function in update and save
reviewSchema.post("save", async function () {
  await this.constructor.calAvgRatingAndQuantity(this.product);
});

// fire the function in delete
reviewSchema.post("remove", async function () {
  await this.constructor.calAvgRatingAndQuantity(this.product);
});

// creating model
const ReviewModel = mongoose.model("Review", reviewSchema);

module.exports = ReviewModel;
