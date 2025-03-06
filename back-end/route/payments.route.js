const express = require('express');
const router = express.Router();
const controller = require('../controller/index');

router.post('/callback', controller.paymentController.callBackPayment);

module.exports = router;