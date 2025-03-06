const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const paymentRoute = require('./payment.route');
const adminRoute = require('./admin.route');
router.use('/authen', authenRoute);
router.use('/payment', paymentRoute);
router.use('/admin', adminRoute);
module.exports = router;