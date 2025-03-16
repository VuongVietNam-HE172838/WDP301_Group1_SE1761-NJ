const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createOrder', authMiddleware, orderController.createOrder);
router.get('/staffOrders', authMiddleware, orderController.getStaffOrders);
router.get('/onlinePaidOrders', authMiddleware, orderController.getOnlinePaidOrders);
router.get('/:orderId', orderController.getOrderDetails);
router.put('/:orderId/status', authMiddleware, orderController.updateOrderStatus);

module.exports = router;