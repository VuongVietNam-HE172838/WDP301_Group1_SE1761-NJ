const express = require('express');
const router = express.Router();
const authenController = require('../controller/authen.controller');

router.post('/login', authenController.login);

module.exports = router;