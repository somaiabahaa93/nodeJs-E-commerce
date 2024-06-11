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


exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  address.alias = req.body.alias || address.alias;
  address.details = req.body.details || address.details;
  address.phone = req.body.phone || address.phone;
  address.city = req.body.city || address.city;
  address.postalCode = req.body.postalCode || address.postalCode;

  await user.save();

  return res.status(200).json({
    status: 'success',
    message: 'Address updated successfully',
    data: address,
  });
});

// @desc      Get Specific address from addresses list
// @route     Get /api/v1/addresses/:addressId
// @access    Private/User
exports.getAddress = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id);

  const address = user.addresses.id(req.params.addressId);

  return res.status(200).json({
    status: 'success',
    data: address,
  });
});


// module.exports=getCategories,createCategory
