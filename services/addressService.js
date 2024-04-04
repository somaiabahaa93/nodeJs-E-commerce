const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

// @desc   get all wishlists
// route  GET /api/v1/wishlis

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address has been added ",
    data: user.addresses,
  });
});

exports.removeAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "address has been removed ",
    data: user.addresses,
  });
});

// get user wishlist
exports.getUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);
  res.status(200).json({
    status: "success",
    data: user.addresses,
  });
});

// module.exports=getCategories,createCategory
