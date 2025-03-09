const AccountDetail = require('../models/accountDetail');

const getUserInformation = async (req, res) => {
  try {
    const userId = req.user.accountId;
    console.log(`User ID from token: ${userId}`); // Log the userId

    const userInfo = await AccountDetail.findOne({ account_id: userId }).populate('account_id');

    if (!userInfo) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userInfo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserInformation };