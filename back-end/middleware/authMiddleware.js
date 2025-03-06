const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('Decoded user:', decoded); // Add logging here
    next();
  } catch (err) {
    console.error('Token verification failed:', err.message); // Add logging here
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;