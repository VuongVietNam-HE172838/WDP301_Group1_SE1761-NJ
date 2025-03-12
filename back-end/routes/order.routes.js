const express = require('express');
const router = express.Router();
const orderController = require('../controller/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/createOrder', authMiddleware, orderController.createOrder);
router.get('/staffOrders', authMiddleware, orderController.getStaffOrders);

module.exports = router;
