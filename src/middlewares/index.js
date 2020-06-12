const { verifyToken, verifyTokenImg } = require('./authentication');

module.exports = {
  AuthMiddleware: verifyToken,
  AuthImgMiddleware: verifyTokenImg,
  AdminRoleMiddleware: require('./verify-admin-role')
};

