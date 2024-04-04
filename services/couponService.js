const asyncHandler = require("express-async-handler");
const CouponModel = require("../models/couponModel");
const factory = require("../utils/handlerFactory");

// @desc   get all brands
// route  GET /api/v1/brands
exports.getCoupons = factory.getAll(CouponModel);

exports.getCoupon = factory.getOne(CouponModel);

exports.updateCoupon = factory.updateOne(CouponModel);

exports.deleteCoupon = factory.deleteOne(CouponModel);

exports.createCoupon = factory.createOne(CouponModel);
