const Account = require('../models/account');

const getAccounts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const accounts = await Account.find().skip(skip).limit(limit);
    const totalAccounts = await Account.countDocuments();

    res.json({
      accounts,
      totalPages: Math.ceil(totalAccounts / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching accounts', error });
  }
};

module.exports = {
  getAccounts,
};