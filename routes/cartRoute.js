const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addProductsToCart,
  getLoggedUserCart,
  removeCartItem,
} = require("../services/cartService");

router.use(authService.protect, authService.allowedTo("user"));

// router.get("/", getBrands);
router
  .route("/")

  .post(addProductsToCart)
  .get(getLoggedUserCart);
router.put(":/itemId", removeCartItem);
module.exports = router;
