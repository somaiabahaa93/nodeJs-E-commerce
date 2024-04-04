const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addAddress,
  removeAddress,
  getUserAddresses,
} = require("../services/addressService");

// router.get("/", getBrands);
router
  .route("/")
  .post(authService.protect, authService.allowedTo("user"), addAddress)
  .get(authService.protect, authService.allowedTo("user"), getUserAddresses);

router.delete(
  "/:addressId",
  authService.protect,
  authService.allowedTo("user"),
  removeAddress
);
module.exports = router;
