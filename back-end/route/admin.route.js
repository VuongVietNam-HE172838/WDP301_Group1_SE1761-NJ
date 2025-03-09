const express = require('express');
const router = express.Router();
const { adminController } = require('../controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/accounts', authMiddleware, adminMiddleware, adminController.getAccounts);

module.exports = router;