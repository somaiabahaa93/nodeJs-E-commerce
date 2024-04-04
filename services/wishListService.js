const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");

// @desc   get all wishlists
// route  GET /api/v1/wishlis

exports.addProductsToWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishList: req.body.productId } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "produc has been added to your wishlist",
    data: user.wishlist,
  });
});

exports.removeProductFromWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishList: req.params.productId } },
    { new: true }
  );
  res.status(200).json({
    status: "success",
    message: "produc has been removed from your wishlist",
    data: user.wishlist,
  });
});

// get user wishlist
exports.getUserWishList = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findById(req.user._id).populate("wishList");
  res.status(200).json({
    status: "success",
    data: user.wishList,
  });
});

// module.exports=getCategories,createCategory
