const jwt = require('jsonwebtoken');

const unauthorizedAdminRequest = (error, res, message) => {
  res.status(401).json({
    ok: false,
    error: message ? { message } : error
  });
}

const verifyAdminRole = (req, res, next) => {
  const role = req.user.role;
  if (role !== 'ADMIN_ROLE') return unauthorizedAdminRequest(null, res, 'Unauthorized request');

  next();
}

module.exports = verifyAdminRole;

