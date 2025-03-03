const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const paymentRoute = require('./payment.route');

router.use('/authen', authenRoute);
router.use('/payment', paymentRoute);
module.exports = router;