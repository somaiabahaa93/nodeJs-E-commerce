const asyncHandler = require("express-async-handler");
const ReviewModel = require("../models/reviewModel");
const factory = require("../utils/handlerFactory");

// @desc   get all reviews
// route  GET /api/v1/reviews
// access  public
exports.getReviews = factory.getAll(ReviewModel);

exports.getReview = factory.getOne(ReviewModel);

exports.updateReview = factory.updateOne(ReviewModel);

exports.deleteReview = factory.deleteOne(ReviewModel);

exports.createReview = factory.createOne(ReviewModel);
// module.exports=getCategories,createCategory

// for nested routes (create)
exports.setParametersToBody = (req, res, next) => {
  if (!req.body.product) {
    req.body.product = req.params.productId;
  }
  if (!req.body.user) {
    req.body.user = req.user._id;
  }

  next();
};
// (get all reviews of product)
exports.createFilterObject = (req, res, next) => {
  let filterObject = {};
  // eslint-disable-next-line no-const-assign
  if (req.params.productId) {
    filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
  }
  next();
};
