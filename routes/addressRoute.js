const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  addAddress,
  removeAddress,
  getUserAddresses,
  updateAddress,
  getAddress,
} = require("../services/addressService");

// router.get("/", getBrands);
router
  .route("/")
  .post(authService.protect, authService.allowedTo("user"), addAddress)
  .get(authService.protect, authService.allowedTo("user"), getUserAddresses);

router
  .route("/:addressId")
  .get(authService.protect, getAddress)
  .delete(authService.protect, removeAddress)
  .put(authService.protect, updateAddress);
module.exports = router;
