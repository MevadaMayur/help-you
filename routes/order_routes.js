const express = require("express");
const router = express.Router();

const orderController = require("../controllers/order_controller");
router.post('/placeOrder', orderController.placeOrder);
router.post('/getOrder', orderController.getOrder);
router.get('/GetOrders', orderController.GetOrders);
router.post('/updateStatus', orderController.updateStatus);


module.exports = router;