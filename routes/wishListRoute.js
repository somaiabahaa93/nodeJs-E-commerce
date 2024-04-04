const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addProductsToWishList,
  removeProductFromWishList,
  getUserWishList,
} = require("../services/wishListService");

// router.get("/", getBrands);
router
  .route("/")
  .post(
    authService.protect,
    authService.allowedTo("user"),
    addProductsToWishList
  )
  .get(authService.protect, authService.allowedTo("user"), getUserWishList);

router.delete(
  "/:productId",
  authService.protect,
  authService.allowedTo("user"),
  removeProductFromWishList
);
module.exports = router;
