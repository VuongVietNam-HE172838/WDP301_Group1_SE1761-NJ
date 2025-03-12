const jwt = require('jsonwebtoken');
const Account = require('../models/account');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('Token:', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const user = await Account.findById(decoded.accountId).populate('role_id');// decoded._id -> decoded.accountId

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'User not found, authorization denied' });
    }

    req.user = user;
    console.log('Authenticated user:', user);

    if (req.path === '/staffOrders' && req.user.role_id.name !== 'STAFF') {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  } catch (err) {
    console.error('Token verification failed:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;