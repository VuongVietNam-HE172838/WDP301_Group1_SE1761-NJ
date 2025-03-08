const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserInformation } = require('../controller/account.controller');

router.get('/information', authMiddleware, getUserInformation);

module.exports = router;