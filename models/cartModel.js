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
    coupon: String,

  },
  { timestamps: true }
);

// cartSchema.pre(/^find/, function (next) {
//   // eslint-disable-next-line no-unused-expressions
//   this.populate({
//     path: "cartItems.product",
//     select: "title -_id",
//     // eslint-disable-next-line no-sequences
//   }),
//     next();
// });

cartSchema.pre(/^find/, function (next) {
this.populate({
  path: 'cartItems.product',
  populate: { path: 'category', select: 'name', model: 'Category' },
}).populate({
    path: 'cartItems.product',
    populate: { path: 'brand', select: 'name', model: 'brand' },
  });
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
