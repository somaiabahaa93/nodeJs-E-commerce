const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addProductsToCart,
  getLoggedUserCart,
  removeCartItem,
  clearLoggedUserCart,
  updateCartProductCount,
  applyCouponToCart,
} = require("../services/cartService");

router.use(authService.protect, authService.allowedTo("user"));
router.route('/applyCoupon').put(applyCouponToCart);


// router.get("/", getBrands);
router
  .route("/")

  .post(addProductsToCart)
  .get(getLoggedUserCart).delete(clearLoggedUserCart);
router.route('/:itemId').put(updateCartProductCount).delete(removeCartItem);

module.exports = router;
