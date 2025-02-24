const authenController = require('./authen.controller');
const otpController = require('./otp.controller');
const orderController = require('./order.controller');
const changepassController = require('./changepass.controller');

module.exports = {
  authenController, orderController, changepassController, otpController
};