const { check } = require("express-validator");
const { default: slugify } = require("slugify");
const validatorMiddleware = require("../../middelwares/validatorMiddleware");
const ReviewModel = require("../../models/reviewModel");

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("rating is required")
    .isFloat()

    .isLength({ min: 1 })
    .withMessage("min length is 1")
    .isLength({ max: 5 })
    .withMessage("max length is 5 "),
  check("product")
    .isMongoId()
    .withMessage("this is invalid id format")
    .notEmpty()
    .withMessage("review must belong to product"),

  check("user")
    .isMongoId()
    .withMessage("this is invalid id format")
    .notEmpty()
    .withMessage("review must belong to user")
    .custom((val, { req }) =>
      ReviewModel.findOne({
        user: req.user._id,
        product: req.body.product,
      }).then((review) => {
        // console.log("user", req.body.user);
        // console.log("product", req.body.product);

        if (review) {
          return Promise.reject(
            new Error("user already created a review befor for this product")
          );
        }
      })
    ),
  validatorMiddleware,
];
exports.getReviewValidator = [
  check("id").isMongoId().withMessage("this is invalid id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("this is invalid id format")
    .custom((val, { req }) =>
      ReviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise(new Error("no review found for this id"));
        }
        // console.log(review.user._id.toString() !== req.user._id.toString());
        // console.log(review.user !== req.user._id);
        // console.log("userLogged", req.user._id);
        // console.log("userwwwhoup", review.user);

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error("you are not allowed to update this review")
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("this is invalid id format")
    .custom((val, { req }) =>
      ReviewModel.findById(val).then((review) => {
        if (!review) {
          return Promise(new Error("no review found for this id"));
        }
        if (req.user.role === "user") {
          if (review.user._id.toString() !== req.user._id.toString()) {
            return Promise.reject(
              new Error("you are not allowed to delete this review")
            );
          }
        }
        return true;
      })
    ),
  validatorMiddleware,
];
