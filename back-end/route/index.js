const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const orderRoute = require('./order.route');
const changepassRoute = require('./changepass.route');

router.use('/authen', authenRoute);
router.use('/order', orderRoute);
router.use('/changepass', changepassRoute);

module.exports = router;