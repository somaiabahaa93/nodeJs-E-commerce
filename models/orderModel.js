const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "order has to belongs to a user"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: [true, "cart must belong to product"],
        },
        quantity: Number,
        color: String,
        price: Number,
      },
    ],
    taxPrice: { type: Number, default: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalOrderPrice: Number,
    paymentMethodType: {
      type: String,
      enum: ["cash", "card"],
      default: "cash",
    },
    isPaid: { type: Boolean, default: false },
    isDeliverd: { type: Boolean, default: false },
    shippingAddress: {
      details: String,
      phone: String,
      postalCode: String,
      city: String,
    },
    paidAt: Date,
    deliverdAt: Date,
  },
  { timestamps: true }
);
orderSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name email phone " }).populate({
    path: "cartItems.product",
    select: "title imageCover",
  });
  next()
});
const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;
