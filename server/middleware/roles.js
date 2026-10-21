const { sendError } = require('../utils/response');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(res, 403, `User role '${req.user ? req.user.role : 'unknown'}' is not authorized to access this route`);
    }
    next();
  };
};

module.exports = { authorize };
