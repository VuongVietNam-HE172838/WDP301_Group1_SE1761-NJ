const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Assuming you have a User model

const router = express.Router();

// Middleware to authenticate the user
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// Change password endpoint
router.post('/change-password', authenticateToken, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).send('User not found');

        // Check if the old password is correct
        const validPass = await bcrypt.compare(oldPassword, user.password);
        if (!validPass) return res.status(400).send('Invalid old password');

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res.send('Password changed successfully');
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;