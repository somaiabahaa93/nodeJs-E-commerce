const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name of coupon is required"],
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "expire date is required"],
    },
    discount: {
      type: Number,
      required: [true, "discount is required"],
    },
  },
  { timeStamps: true }
);

const CouponModel = mongoose.model("Coupon", couponSchema);
module.exports = CouponModel;
