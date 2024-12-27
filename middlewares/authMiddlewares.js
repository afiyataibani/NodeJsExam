const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
module.exports.verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request object
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Middleware to enforce role-based access
module.exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
