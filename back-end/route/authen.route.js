const express = require('express');
const router = express.Router();
const authenController = require('../controller/authen.controller');

router.post('/login', authenController.login);
router.post('/google-login', authenController.googleLogin);
router.post("/register", authenController.register);
router.get("/verify-email", authenController.verifyEmail);

module.exports = router;