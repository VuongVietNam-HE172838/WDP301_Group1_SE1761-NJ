const authenController = require('./authen.controller');
const otpController = require('./otp.controller');
const paymentController = require('./payment.controller');
const orderController = require('./order.controller');
const adminController = require('./admin.controller');
module.exports = {
  authenController, otpController, paymentController, orderController, adminController
};