const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "cart must belong to product"],
        },
        quantity: { type: Number, default: 1 },
        color: String,
        price: Number,
      },
    ],
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "cart must belong to user"],
    },
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
