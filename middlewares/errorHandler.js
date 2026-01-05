// Custom error class for API errors
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error creators
const createError = {
  badRequest: (message = 'Bad request') => new ApiError(400, message),
  unauthorized: (message = 'Unauthorized') => new ApiError(401, message),
  forbidden: (message = 'Forbidden') => new ApiError(403, message),
  notFound: (message = 'Not found') => new ApiError(404, message),
  conflict: (message = 'Conflict') => new ApiError(409, message),
  tooManyRequests: (message = 'Too many requests') => new ApiError(429, message),
  internal: (message = 'Internal server error') => new ApiError(500, message, false),
};

// Handle specific MongoDB errors
const handleMongoError = (err) => {
  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return new ApiError(409, `${field} already exists`);
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return new ApiError(400, messages.join(', '));
  }

  // Cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return new ApiError(400, `Invalid ${err.path}: ${err.value}`);
  }

  return null;
};

// Handle JWT errors
const handleJWTError = (err) => {
  if (err.name === 'JsonWebTokenError') {
    return new ApiError(401, 'Invalid token');
  }
  if (err.name === 'TokenExpiredError') {
    return new ApiError(401, 'Token has expired');
  }
  return null;
};

// Async handler wrapper to avoid try-catch in every controller
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error for debugging
  console.error('Error:', {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  // Handle specific error types
  const mongoError = handleMongoError(err);
  if (mongoError) error = mongoError;

  const jwtError = handleJWTError(err);
  if (jwtError) error = jwtError;

  // Multer file upload errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    error = new ApiError(400, 'File too large');
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    error = new ApiError(400, 'Too many files');
  }
  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    error = new ApiError(400, 'Unexpected file field');
  }

  // Default to 500 if no status code
  const statusCode = error.statusCode || 500;
  const message = error.isOperational ? error.message : 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack
    })
  });
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
};

module.exports = {
  ApiError,
  createError,
  asyncHandler,
  errorHandler,
  notFoundHandler
};
