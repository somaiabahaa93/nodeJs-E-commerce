const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
    createCashOrder,
    filterLoggedUserOrders,
    getAllOrders,
    getSpecificOrder,updateOrderDeliver,updateOrderPay,
    checkoutSession
} = require("../services/orderService");


router.use(authService.protect)
router.get('/checkout-session/:cartId', checkoutSession);

router.route("/:cartId").post(authService.allowedTo("user"),createCashOrder)
router.get('/',authService.allowedTo("user",'admin','manager'),filterLoggedUserOrders,getAllOrders)
router.route("/:id").get(getSpecificOrder)
router.put('/:id/pay',authService.allowedTo('admin','manager'),updateOrderPay)
router.put('/:id/deliver',authService.allowedTo('admin','manager'),updateOrderDeliver)



module.exports = router;
