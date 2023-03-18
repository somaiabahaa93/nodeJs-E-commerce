const express = require("express");

const router = express.Router({ mergeParams: true });
const {
  createReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} = require("../utils/validators/reviewValidator");
const authService = require("../services/authService");

const {
  getReviews,
  createReview,
  getReview,
  updateReview,
  deleteReview,
  setParametersToBody,
  createFilterObject,
} = require("../services/reviewService");

// router.get("/", getBrands);
router.route("/").get(createFilterObject, getReviews).post(
  authService.protect,
  authService.allowedTo("user"),
  setParametersToBody,

  createReviewValidator,
  createReview
);
router
  .route("/:id")
  .get(getReview)
  .put(
    authService.protect,
    authService.allowedTo("user"),

    updateReviewValidator,
    updateReview
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin", "user", "manager"),
    deleteReviewValidator,
    deleteReview
  );

module.exports = router;
