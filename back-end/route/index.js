const express = require('express');
const router = express.Router();

const authenRoute = require('./authen.route');
const menuRoute = require('./menu.routes');
const blogRoutes = require('./blog.route');


router.use('/authen', authenRoute);
router.use('/menu', menuRoute);
router.use('/blog', blogRoutes);
module.exports = router;