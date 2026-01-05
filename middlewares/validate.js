const { body, param, query, validationResult } = require('express-validator');

// Validation result handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};

// Common validation rules
const commonRules = {
  mongoId: (field = 'id') =>
    param(field)
      .isMongoId()
      .withMessage(`Invalid ${field} format`),

  email: (field = 'email') =>
    body(field)
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email'),

  phone: (field = 'phone') =>
    body(field)
      .matches(/^[6-9]\d{9}$/)
      .withMessage('Please provide a valid 10-digit Indian phone number'),

  pincode: (field = 'pincode') =>
    body(field)
      .matches(/^\d{6}$/)
      .withMessage('Please provide a valid 6-digit pincode'),

  requiredString: (field, minLength = 1, maxLength = 500) =>
    body(field)
      .trim()
      .notEmpty()
      .withMessage(`${field} is required`)
      .isLength({ min: minLength, max: maxLength })
      .withMessage(`${field} must be between ${minLength} and ${maxLength} characters`),

  optionalString: (field, maxLength = 500) =>
    body(field)
      .optional()
      .trim()
      .isLength({ max: maxLength })
      .withMessage(`${field} must be less than ${maxLength} characters`),

  positiveNumber: (field) =>
    body(field)
      .isFloat({ min: 0 })
      .withMessage(`${field} must be a positive number`),

  positiveInt: (field) =>
    body(field)
      .isInt({ min: 0 })
      .withMessage(`${field} must be a positive integer`),
};

// Order validation
const validateOrder = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),
  body('quantity')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('customer.name')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required')
    .isLength({ max: 100 })
    .withMessage('Customer name is too long'),
  body('customer.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('customer.phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Valid 10-digit phone number is required'),
  body('shippingAddress.address')
    .trim()
    .notEmpty()
    .withMessage('Shipping address is required'),
  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('shippingAddress.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Valid 6-digit pincode is required'),
  handleValidationErrors
];

// Payment validation
const validatePayment = [
  body('razorpayOrderId')
    .notEmpty()
    .withMessage('Razorpay order ID is required'),
  body('razorpayPaymentId')
    .notEmpty()
    .withMessage('Razorpay payment ID is required'),
  body('razorpaySignature')
    .notEmpty()
    .withMessage('Razorpay signature is required'),
  handleValidationErrors
];

// Product validation
const validateProduct = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 200 })
    .withMessage('Product name is too long'),
  body('category')
    .isMongoId()
    .withMessage('Valid category is required'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer'),
  handleValidationErrors
];

// Category validation
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 100 })
    .withMessage('Category name is too long'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description is too long'),
  handleValidationErrors
];

// Login validation
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Article validation
const validateArticle = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title is too long'),
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required'),
  handleValidationErrors
];

// Banner validation
const validateBanner = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title is too long'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
];

// MongoDB ID param validation
const validateMongoId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  commonRules,
  validateOrder,
  validatePayment,
  validateProduct,
  validateCategory,
  validateLogin,
  validateArticle,
  validateBanner,
  validatePagination,
  validateMongoId
};
