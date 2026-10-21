const { sendError } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Server Error';
  let errors = null;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    message = 'Resource not found';
    statusCode = 400;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = 'Duplicate field value entered';
    statusCode = 409;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    message = 'Validation Error';
    statusCode = 400;
    errors = Object.values(err.errors).map(val => val.message);
  }
  
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid token. Please log in again!';
    statusCode = 401;
  }
  
  if (err.name === 'TokenExpiredError') {
    message = 'Your token has expired! Please log in again.';
    statusCode = 401;
  }

  sendError(res, statusCode, message, errors);
};

module.exports = errorHandler;
