const stripe = require('stripe')(process.env.STRIPE_KEY);

const asyncHandler = require("express-async-handler");
const cartModel = require("../models/cartModel");
const ApiError = require("../utils/ApiError");
const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const OrderModel = require("../models/orderModel");
const factory = require("../utils/handlerFactory");



exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const shippingPrice = 0;
  const taxPrice = 0;
  // route api/v1/orders/cartId
  // 1-get cart depending on cartId
  const cart = await cartModel.findById(req.params.cartId);
  if (!cart) {
    return next(new ApiError("there is no cart found here  ", 404));
  }
  // 2- get total orderPrice depend on cart
  const totalPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;
  const totalOrderPrice = totalPrice + shippingPrice + taxPrice;
  // 3-craete order with defalu cash
  const order = await orderModel.create({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });
  // 4-reduce quantity in DB and increase sold

  if (order) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await productModel.bulkWrite(bulkOption, {});
    // 5-clear cart

    await cartModel.findByIdAndDelete(req.params.cartId);
  }
  res.status(201).json({ data: order, message: "success" });
});

exports.filterLoggedUserOrders=asyncHandler((req,res,next)=>{
  if(req.user.role==='user') req.filterObj={user:req.user._id}
  next();
})

exports.getAllOrders=factory.getAll(OrderModel);

exports.getSpecificOrder=factory.getOne(OrderModel)



exports.updateOrderPay=asyncHandler(async(req,res,next)=>{
const order =await orderModel.findById(req.params.id)
if(!order)
return next (ApiError("no order found for this id",404))

order.isPaid=true
order.paidAt=Date.now()
const updatedOrder= await order.save()
res.status(200).json({data:updatedOrder,status:"success"})


})


exports.updateOrderDeliver=asyncHandler(async(req,res,next)=>{
  const order =await orderModel.findById(req.params.id)
  if(!order)
  return next (ApiError("no order found for this id",404))
  
  order.isDeliverd=true
  order.deliverdAt=Date.now()
  const updatedOrder= await order.save()
  res.status(200).json({data:updatedOrder,status:"success"})
  
  
  })



  exports.checkoutSession=asyncHandler(async(req,res,next)=>{
    const shippingPrice = 0;
    const taxPrice = 0;
    // route api/v1/orders/cartId
    // 1-get cart depending on cartId
    const cart = await cartModel.findById(req.params.cartId);
    if (!cart) {
      return next(new ApiError("there is no cart found here  ", 404));
    }
    // 2- get total orderPrice depend on cart
    const totalPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;
    const totalOrderPrice = totalPrice + shippingPrice + taxPrice;
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'egp',
            product_data: {
              name: req.user.name,
            },
            unit_amount: totalOrderPrice *100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get("host")}/orders`,
      cancel_url: `${req.protocol}://${req.get("host")}/cart`,
      customer_email:req.user.email,
      metadata:req.body.shippingAddress,
      client_reference_id:req.params.cartId
    });
res.status(200).json({status:"success",data:session})
  })