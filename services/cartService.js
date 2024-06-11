const asyncHandler = require("express-async-handler");
const CartModel = require("../models/cartModel");
const ProductModel = require("../models/productModel");
const ApiError = require("../utils/ApiError");
const CouponModel=require("../models/couponModel");
const cartModel = require("../models/cartModel");

// calculate total price for cart

const calcTotalPrice = async(cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((prod) => {
    totalPrice += prod.price * prod.quantity;
  });

  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  cart.coupon = undefined;

  await cart.save();

  return totalPrice;
};


exports.addProductsToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;
  const product = await ProductModel.findById(productId);
  // console.log("Price", product.price);
  // get user cart or create it if not exists
  let cart = await CartModel.findOne({ user: req.user._id });
 
  if (cart) {
     // 2) check if product exists for user cart
     const itemIndex = cart.cartItems.findIndex(
      (p) =>
        p.product._id.toString() === req.body.productId &&
        p.color === req.body.color
    );

    if (itemIndex > -1) {
      //product exists in the cart, update the quantity
      const productItem = cart.cartItems[itemIndex];
      productItem.quantity += 1;
      cart.cartItems[itemIndex] = productItem;
    } else {
      //product does not exists in cart, add new item
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  if (!cart) {
    cart = await CartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, color: color, price: product.price }],
    });
  } 

  await calcTotalPrice(cart);
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
      return next(
        new ApiError(`No cart exist for this user: ${req.user._id}`, 404)
      );
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


exports.clearLoggedUserCart = asyncHandler(async (req, res, next) => {
  await CartModel.findOneAndDelete({ user: req.user._id });

  res.status(204).send();
});



exports.updateCartProductCount = asyncHandler(async (req, res, next) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  // 1) Check if there is cart for logged user
  const cart = await CartModel.findOne({ user: req.user._id })
    .populate({
      path: 'cartItems.product',
      select: 'title imageCover ratingsAverage brand category ',
      populate: { path: 'brand', select: 'name -_id', model: 'brand' },
    })
    .populate({
      path: 'cartItems.product',
      select: 'title imageCover ratingsAverage brand category',
      populate: { path: 'category', select: 'name -_id', model: 'Category' },
    });
  if (!cart) {
    return next(
      new ApiError(`No cart exist for this user: ${req.user._id}`, 404)
    );
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === itemId
  );
console.log("cartItttttttttttttttttttttttttem",cart.cartItems[0]._id)
console.log("parammmmmmmmmmmmm",itemId)
  if (itemIndex > -1) {
    //product exists in the cart, update the quantity
    console.log("indeeex",itemIndex)
    console.log("qqqqqqqqqqqqq",quantity)
    const productItem = cart.cartItems[itemIndex];
    productItem.quantity = quantity;
    cart.cartItems[itemIndex] = productItem;
  } else {
    return next(
      new ApiError(`No Product Cart item found for this id: ${itemId}`)
    );
  }
  // Calculate total cart price

  calcTotalPrice(cart);
  res.status(200).json({
    message: " product added success",
    totalItemsNumber: cart.cartItems.length,

    data: cart,
  });
 
});


exports.applyCouponToCart = asyncHandler(async (req, res, next) => {
  const { couponName } = req.body;
  console.log(couponName);

  // 2) Get current user cart
  const cart = await CartModel.findOne({ user: req.user._id })
    // .populate({
    //   path: 'products.product',
    //   select: 'title imageCover ratingsAverage brand category ',
    //   populate: { path: 'brand', select: 'name -_id', model: 'Brand' },
    // })
    // .populate({
    //   path: 'products.product',
    //   select: 'title imageCover ratingsAverage brand category',
    //   populate: { path: 'category', select: 'name -_id', model: 'Category' },
    // });

  // 1) Get coupon based on it's unique name and expire > date.now
  const coupon = await CouponModel.findOne({
    name: couponName,
    expire: { $gt: Date.now() },
  });
  console.log("couponF>>>>>>>>>>>>",coupon)
  if (!coupon) {
    cart.totalPriceAfterDiscount = undefined;
    cart.coupon = undefined;
    await cart.save();
    return next(new ApiError('Coupon is invalid or has expired', 400));
  }

  const totalPrice = await calcTotalPrice(cart)
console.log("totalPrice",totalPrice)
  const totalAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2)// 99.99
console.log("Affffffffffffffff",cart.totalPriceAfterDiscount)
  cart.totalPriceAfterDiscount = totalAfterDiscount;
  cart.coupon = coupon.name;
  console.log("Affffffffffffffff222222222222",cart.totalPriceAfterDiscount)
  console.log("couponF2222222222222222222>>>>>>>>>>>>",coupon)

  await cart.save();

  return res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    coupon: coupon.name,
    data: cart,
  });
});