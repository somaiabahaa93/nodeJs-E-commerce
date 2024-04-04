const asyncHandler = require("express-async-handler");
const CartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/ApiError");

// calculate total price for cart
const calcTotalPrice = (cart) => {
  let totalprice = 0;
  cart.cartItems.forEach((item) => {
    totalprice += item.price * item.quantity;
    cart.totalCartPrice = totalprice;
  });
};
exports.addProductsToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);
  console.log("Price", product.price);
  // get user cart or create it if not exists
  let cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color: color, price: product.price }],
    });
  } else {
    // if product already exists + quantity else add it
    // eslint-disable-next-line array-callback-return
    console.log("cart", cart.cartItems);

    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    if (productIndex > -1) {
      // product exists
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      // product not in the cart
      cart.cartItems.push({
        product: productId,
        color: color,
        price: product.price,
      });
    }
  }

  calcTotalPrice(cart);
  res.status(200).json({
    message: " product added success",
    totalItemsNumber: cart.cartItems.length,

    data: cart,
  });

  await cart.save();
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOne({ user: req.user._id });
  if (!cart) {
    return new ApiError("there is no cart for this user", 404);
  } 
    res.status(200).json({
      totalItemsNumber: cart.cartItems.length,
      data: cart,
      message: "success",
    });
  
});

exports.removeCartItem = asyncHandler(async (req, res, next) => {
  const cart = await CartModel.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );
  if (!cart) {
    return new ApiError("there is no cart for this user", 404);
  } 
    calcTotalPrice(cart);
    await cart.save();
    res.status(200).json({
      totalItemsNumber: cart.cartItems.length,
      data: cart,
      message: "success",
    });
  
});
