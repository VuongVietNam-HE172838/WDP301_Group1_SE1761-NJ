const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getUserInformation, updateUserInformation, upload } = require('../controller/account.controller');

router.get('/information', authMiddleware, getUserInformation);
router.put('/information', authMiddleware, upload.single("profile_picture"),updateUserInformation); // Add this line for updating user information

module.exports = router;