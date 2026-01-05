const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  loginUser,
  getMe,
} = require('../controllers/userController.js');
const authenticateToken = require('../middlewares/authenticateToken.js');
const { handleValidationErrors } = require('../middlewares/validate.js');

// Validation rules
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

// Public routes
router.post('/login', validateLogin, loginUser);

// Protected routes
router.get('/me', authenticateToken, getMe);

module.exports = router;