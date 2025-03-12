const AccountDetail = require('../models/accountDetail');

const getUserInformation = async (req, res) => {
  try {
    const userId = req.user.accountId;
    console.log(`User ID from token: ${userId}`); // Log the userId

    const userInfo = await AccountDetail.findOne({ account_id: userId }).populate('account_id');
    console.log('User info:', userInfo); // Log the userInfo

    if (!userInfo) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(userInfo);
  } catch (error) {
    console.error('Error fetching user information:', error.message); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserInformation = async (req, res) => {
  try {
    const userId = req.user.accountId;
    const { full_name, phone_number, birth_of_date, id_number, gender, address, profile_picture } = req.body;

    const updatedUserInfo = await AccountDetail.findOneAndUpdate(
      { account_id: userId },
      { full_name, phone_number, birth_of_date, id_number, gender, address, profile_picture },
      { new: true, runValidators: true }
    );

    if (!updatedUserInfo) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUserInfo);
  } catch (error) {
    console.error('Error updating user information:', error.message); // Log the error
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserInformation, updateUserInformation };