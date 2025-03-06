const Account = require('../models/account');
const Role = require('../models/role');

const adminMiddleware = async (req, res, next) => {
  try {
    console.log('Checking admin role...: ', req.user); // Log req.user
    const account = await Account.findById(req.user.accountId).populate('role_id');
    console.log('Account:', account);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }
    if (!account.role_id) {
      return res.status(500).json({ message: 'Role not found for account' });
    }
    if (account.role_id.name !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (error) {
    console.log('Error checking admin role:', error.message);
    res.status(500).json({ message: 'Error checking admin role', error });
  }
};

module.exports = adminMiddleware;