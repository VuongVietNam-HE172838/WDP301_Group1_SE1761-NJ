const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const adminRoute = require('./admin.route');
const menuRoute = require('./menu.route');
const orderRoute = require('./order.route');
const blogRoute = require('./blog.route');
const paymentRoute = require('./payments.route');
const accountRoute = require('./account.route');

router.use('/authen', authenRoute);
router.use('/menu', menuRoute);
router.use('/order', orderRoute);
router.use('/blogs', blogRoute);
router.use('/account', accountRoute);
router.use('/payments', paymentRoute);
router.use('/admin', adminRoute);


module.exports = router;