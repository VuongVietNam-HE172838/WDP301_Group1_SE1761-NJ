const express = require('express');
const router = express.Router();
const authenController = require('../controller/authen.controller');

router.post('/login', authenController.login);
router.post('/google-login', authenController.googleLogin);

module.exports = router;