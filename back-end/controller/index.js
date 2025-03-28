const authenController = require('./authen.controller');
const otpController = require('./otp.controller');
const paymentController = require('./payments.controller');
const orderController = require('./order.controller');
const changepassController = require('./changepass.controller');
const adminController = require('./admin.controller');
const accountController = require('./account.controller');
const cartController = require('./cart.controller');
module.exports = {
  authenController, orderController, 
  changepassController, otpController, 
  paymentController, adminController,
  accountController, cartController
};