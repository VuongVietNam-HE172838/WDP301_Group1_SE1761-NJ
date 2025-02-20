const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Account } = require('../models'); 

const router = express.Router();

router.post('/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    try {
        const account = await Account.findOne ({ username });
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(newPassword, salt);
        await account.save();
        res.status(200).json({ message: 'Change password successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
);

module.exports = router;