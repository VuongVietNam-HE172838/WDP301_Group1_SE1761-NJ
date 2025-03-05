const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const orderRoute = require('./order.route');
const changepassRoute = require('./changepass.route');
const menuRoute = require('./menu.route');
const blogRoutes = require('./blog.route');


router.use('/authen', authenRoute);
router.use('/order', orderRoute);
router.use('/changepass', changepassRoute);
router.use('/menu', menuRoute);
router.use('/blog', blogRoutes);
module.exports = router;