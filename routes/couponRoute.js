const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  getCoupons,
  createCoupon,
  updateCoupon,
  getCoupon,
  deleteCoupon,
} = require("../services/couponService");

// router.get("/", getBrands);
router.use(authService.protect, authService.allowedTo("admin", "manager"));
router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
