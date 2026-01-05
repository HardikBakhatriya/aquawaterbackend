const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const {
  createRazorpayOrder,
  verifyPaymentAndCreateOrder,
  getOrders,
  getOrderById,
  trackOrder,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
  getRevenueChartData,
  getWeeklyOrdersChartData,
} = require('../controllers/orderController.js');
const authenticateToken = require('../middlewares/authenticateToken.js');
const { handleValidationErrors, validatePagination, validateMongoId } = require('../middlewares/validate.js');

// Validation rules
const validateCreateOrder = [
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingCharge').optional().isFloat({ min: 0 }).withMessage('Shipping charge must be positive'),
  handleValidationErrors
];

const validateVerifyPayment = [
  body('razorpayOrderId').notEmpty().withMessage('Razorpay order ID is required'),
  body('razorpayPaymentId').notEmpty().withMessage('Razorpay payment ID is required'),
  body('razorpaySignature').notEmpty().withMessage('Razorpay signature is required'),
  body('productId').isMongoId().withMessage('Invalid product ID'),
  body('customer.name').trim().notEmpty().withMessage('Customer name is required'),
  body('customer.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('customer.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone is required'),
  body('shippingAddress.address').trim().notEmpty().withMessage('Address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.pincode').matches(/^\d{6}$/).withMessage('Valid 6-digit pincode is required'),
  handleValidationErrors
];

const validateOrderStatus = [
  body('orderStatus')
    .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  body('trackingNumber').optional().trim(),
  handleValidationErrors
];

// Public routes
router.post('/create-razorpay-order', validateCreateOrder, createRazorpayOrder);
router.post('/verify-payment', validateVerifyPayment, verifyPaymentAndCreateOrder);
router.get('/track/:orderId', trackOrder);

// Admin routes (protected)
router.get('/', authenticateToken, validatePagination, getOrders);
router.get('/stats', authenticateToken, getOrderStats);
router.get('/chart/revenue', authenticateToken, getRevenueChartData);
router.get('/chart/weekly', authenticateToken, getWeeklyOrdersChartData);
router.get('/:id', authenticateToken, validateMongoId, getOrderById);
router.put('/:id/status', authenticateToken, validateMongoId, validateOrderStatus, updateOrderStatus);
router.put('/:id/cancel', authenticateToken, validateMongoId, cancelOrder);
router.delete('/:id', authenticateToken, validateMongoId, deleteOrder);

module.exports = router;
