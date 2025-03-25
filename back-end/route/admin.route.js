const express = require('express');
const router = express.Router();
const { adminController } = require('../controller');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

// Get paginated list of accounts
router.get('/accounts', authMiddleware, adminMiddleware, adminController.getAccounts);

// Get order history
router.get('/orders', authMiddleware, adminMiddleware, adminController.getOrderHistory);

// Get bill history
router.get('/bills', authMiddleware, adminMiddleware, adminController.getBillHistory);

router.get('/revenue', authMiddleware, adminMiddleware, adminController.getRevenueStatistics);
router.put('/accounts/:accountId', authMiddleware, adminMiddleware, adminController.updateAccountVerification);
router.get('/accounts/statistics', authMiddleware, adminMiddleware, adminController.getAccountStatistics);

module.exports = router;
module.exports = router;