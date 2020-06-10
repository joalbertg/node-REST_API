module.exports = { 
  AuthMiddleware: require('./authentication'),
  AdminRoleMiddleware: require('./verify-admin-role')
};

