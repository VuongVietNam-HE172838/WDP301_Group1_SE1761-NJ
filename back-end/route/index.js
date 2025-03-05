const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const menuRoute = require('./menu.route');
// const orderRoute = require('./order.route');
// const changepassRoute = require('./changepass.route');
const blogRoute = require('./blog.route');

router.use('/authen', authenRoute);
router.use('/menu', menuRoute);
// router.use('/order', orderRoute);
// router.use('/changepass', changepassRoute);
router.use('/blogs', blogRoute);

module.exports = router;