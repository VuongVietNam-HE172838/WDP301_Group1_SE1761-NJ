const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Account, AccountDetail } = require('../models');

exports.login = async (req, res) => {
  const { user_name, password } = req.body;

  try {
    const account = await Account.findOne({ user_name });
    if (!account) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { accountId: account._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });

    await AccountDetail.findOneAndUpdate({ account_id: account._id }, { refresh_token: refreshToken });

    res.json({ token, refreshToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};