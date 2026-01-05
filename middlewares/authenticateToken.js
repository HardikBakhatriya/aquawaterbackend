const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access token required"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: "Token has expired",
          code: "TOKEN_EXPIRED"
        });
      }
      return res.status(403).json({
        success: false,
        message: "Invalid token"
      });
    }

    req.user = decoded;
    next();
  });
};

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }
  next();
};

// Combined middleware for admin-only routes
const authenticateAdmin = [authenticateToken, requireAdmin];

module.exports = authenticateToken;
module.exports.requireAdmin = requireAdmin;
module.exports.authenticateAdmin = authenticateAdmin;
