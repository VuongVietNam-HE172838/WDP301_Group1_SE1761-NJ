const express = require('express');
const   router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controller/index');

router.post('/callback', controller.paymentController.callBackPayment);
router.post('/create', authMiddleware, controller.paymentController.createBill);
router.get('/checkstatus/:billId', authMiddleware, controller.paymentController.checkPaymentStatus);

module.exports = router;