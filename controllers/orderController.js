const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const razorpay = require('../config/razorpay.js');
const crypto = require('crypto');

// Helper function to send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
  try {
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ShreeFlow</title>
    <style>
        body {
            font-family: 'Inter', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 8px;
        }
        .tagline {
            color: #bae6fd;
            font-size: 14px;
        }
        .success-badge {
            background: #22c55e;
            color: white;
            padding: 10px 20px;
            border-radius: 50px;
            display: inline-block;
            margin-top: 15px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
        }
        .greeting {
            color: #0284c7;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        .order-id-box {
            background: #f0f9ff;
            border: 2px dashed #0ea5e9;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 20px 0;
        }
        .order-id-label {
            color: #666;
            font-size: 14px;
            margin-bottom: 5px;
        }
        .order-id {
            color: #0284c7;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .section {
            margin: 25px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 10px;
        }
        .section-title {
            color: #0284c7;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 10px;
        }
        .product-box {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .product-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            object-fit: cover;
            background: #f1f5f9;
        }
        .product-details h4 {
            margin: 0 0 5px 0;
            color: #1e293b;
        }
        .product-details p {
            margin: 0;
            color: #64748b;
            font-size: 14px;
        }
        .price-table {
            width: 100%;
            margin-top: 20px;
        }
        .price-table td {
            padding: 8px 0;
        }
        .price-table .label {
            color: #64748b;
        }
        .price-table .value {
            text-align: right;
            font-weight: 500;
        }
        .price-table .total {
            border-top: 2px solid #e2e8f0;
            font-size: 18px;
            font-weight: bold;
            color: #0284c7;
        }
        .address-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        .address-box p {
            margin: 5px 0;
            color: #475569;
        }
        .status-timeline {
            display: flex;
            justify-content: space-between;
            margin: 20px 0;
            position: relative;
        }
        .status-step {
            text-align: center;
            flex: 1;
        }
        .status-dot {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #e2e8f0;
            margin: 0 auto 8px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .status-dot.active {
            background: #22c55e;
            color: white;
        }
        .status-dot.current {
            background: #0ea5e9;
            color: white;
        }
        .status-label {
            font-size: 12px;
            color: #64748b;
        }
        .footer {
            background: #1e293b;
            color: white;
            padding: 25px;
            text-align: center;
        }
        .footer-links {
            margin: 15px 0;
        }
        .footer-links a {
            color: #0ea5e9;
            text-decoration: none;
            margin: 0 10px;
        }
        .help-box {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin-top: 20px;
        }
        .help-box h4 {
            color: #b45309;
            margin: 0 0 10px 0;
        }
        .help-box p {
            color: #92400e;
            margin: 0;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">ShreeFlow</div>
            <div class="tagline">Smart Water Tank Solutions</div>
            <div class="success-badge">✓ Order Confirmed</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Thank you for your order, ${order.customer.name}!</div>

            <p style="color: #64748b;">
                We're excited to let you know that we've received your order and it's being processed.
                You'll receive another email when your order ships.
            </p>

            <!-- Order ID -->
            <div class="order-id-box">
                <div class="order-id-label">Order ID</div>
                <div class="order-id">${order.orderId}</div>
                <div style="color: #64748b; font-size: 13px; margin-top: 10px;">
                    Placed on ${orderDate}
                </div>
            </div>

            <!-- Order Status -->
            <div class="section">
                <div class="section-title">📦 Order Status</div>
                <div class="status-timeline">
                    <div class="status-step">
                        <div class="status-dot active">✓</div>
                        <div class="status-label">Confirmed</div>
                    </div>
                    <div class="status-step">
                        <div class="status-dot">2</div>
                        <div class="status-label">Processing</div>
                    </div>
                    <div class="status-step">
                        <div class="status-dot">3</div>
                        <div class="status-label">Shipped</div>
                    </div>
                    <div class="status-step">
                        <div class="status-dot">4</div>
                        <div class="status-label">Delivered</div>
                    </div>
                </div>
            </div>

            <!-- Product Details -->
            <div class="section">
                <div class="section-title">🛒 Order Details</div>
                <div class="product-box">
                    ${order.product.image ? `<img src="${order.product.image}" alt="${order.product.name}" class="product-image">` : ''}
                    <div class="product-details">
                        <h4>${order.product.name}</h4>
                        <p>Quantity: ${order.product.quantity}</p>
                        <p style="color: #0284c7; font-weight: 600;">₹${order.product.price.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <table class="price-table">
                    <tr>
                        <td class="label">Subtotal</td>
                        <td class="value">₹${order.subtotal.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                        <td class="label">Shipping</td>
                        <td class="value">${order.shippingCharge > 0 ? '₹' + order.shippingCharge.toLocaleString('en-IN') : 'FREE'}</td>
                    </tr>
                    ${order.tax > 0 ? `
                    <tr>
                        <td class="label">Tax</td>
                        <td class="value">₹${order.tax.toLocaleString('en-IN')}</td>
                    </tr>
                    ` : ''}
                    <tr class="total">
                        <td>Total</td>
                        <td class="value">₹${order.totalAmount.toLocaleString('en-IN')}</td>
                    </tr>
                </table>
            </div>

            <!-- Shipping Address -->
            <div class="section">
                <div class="section-title">📍 Shipping Address</div>
                <div class="address-box">
                    <p><strong>${order.customer.name}</strong></p>
                    <p>${order.shippingAddress.address}</p>
                    <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
                    <p>PIN: ${order.shippingAddress.pincode}</p>
                    <p>📞 ${order.customer.phone}</p>
                </div>
            </div>

            <!-- Payment Info -->
            <div class="section">
                <div class="section-title">💳 Payment Information</div>
                <div class="address-box">
                    <p><strong>Payment Status:</strong> <span style="color: #22c55e;">✓ Paid</span></p>
                    <p><strong>Payment Method:</strong> ${order.payment.type ? order.payment.type.toUpperCase() : 'Online'}</p>
                    <p><strong>Transaction ID:</strong> ${order.payment.razorpayPaymentId || 'N/A'}</p>
                </div>
            </div>

            <!-- Help Box -->
            <div class="help-box">
                <h4>Need Help?</h4>
                <p>If you have any questions about your order, please contact us at support@shreeflow.com or call +91 8168304716</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div style="margin-bottom: 15px;">
                <strong>ShreeFlow</strong><br>
                <span style="color: #94a3b8;">Smart Water Tank Solutions</span>
            </div>

            <div class="footer-links">
                <a href="#">Track Order</a> •
                <a href="#">Support</a> •
                <a href="#">Products</a>
            </div>

            <div style="color: #64748b; font-size: 12px; margin-top: 15px;">
                28, Vijay Nagar, Indore, MP 452010<br>
                +91 8168304716 | +91 9599268300
            </div>

            <div style="margin-top: 15px; font-size: 12px; color: #64748b;">
                © ${new Date().getFullYear()} ShreeFlow. All rights reserved.
            </div>
        </div>
    </div>
</body>
</html>`;

    // Send email using Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: 'ShreeFlow',
          email: 'contact@swedhaessentials.com',
        },
        to: [
          {
            email: order.customer.email,
            name: order.customer.name,
          },
        ],
        bcc: [
          {
            email: 'contact@swedhaessentials.com',
            name: 'ShreeFlow Orders',
          },
        ],
        subject: `Order Confirmed! #${order.orderId} - ShreeFlow`,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to send order confirmation email:', errorData);
    } else {
      console.log(`Order confirmation email sent to ${order.customer.email}`);
    }
  } catch (error) {
    // Don't throw error - email failure shouldn't affect order
    console.error('Error sending order confirmation email:', error.message);
  }
};

// @desc    Create Razorpay order
// @route   POST /api/orders/create-razorpay-order
// @access  Public
const createRazorpayOrder = async (req, res) => {
  try {
    const { productId, quantity = 1, shippingCharge = 0 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
      });
    }

    // Calculate amount: product price (use discountPrice if available) + shipping
    const productPrice = product.discountPrice || product.price;
    const subtotal = productPrice * quantity;
    const totalAmount = subtotal + shippingCharge;
    const amountInPaise = Math.round(totalAmount * 100); // Amount in paise

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `order_${Date.now()}`,
      notes: {
        productId: productId,
        productName: product.name,
        quantity: quantity,
        shippingCharge: shippingCharge,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        product: {
          id: product._id,
          name: product.name,
          price: productPrice,
          image: product.images[0]?.url,
        },
        subtotal,
        shippingCharge,
        totalAmount,
      },
    });
  } catch (error) {
    console.error('Create Razorpay order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Razorpay order',
      error: error.message,
    });
  }
};

// @desc    Verify payment and create order
// @route   POST /api/orders/verify-payment
// @access  Public
const verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      productId,
      quantity = 1,
      customer,
      shippingAddress,
      shippingCharge = 0,
      courierName,
    } = req.body;

    // Validate required fields
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment details',
      });
    }

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer details are required',
      });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required',
      });
    }

    // Step 1: Verify signature
    const sign = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (razorpaySignature !== expectedSign) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Step 2: Fetch and verify payment from Razorpay API
    let razorpayPayment;
    try {
      razorpayPayment = await razorpay.payments.fetch(razorpayPaymentId);
    } catch (fetchError) {
      console.error('Error fetching payment from Razorpay:', fetchError);
      return res.status(400).json({
        success: false,
        message: 'Unable to verify payment with Razorpay',
      });
    }

    // Step 3: Verify payment status is captured
    if (razorpayPayment.status !== 'captured') {
      return res.status(400).json({
        success: false,
        message: `Payment not completed. Status: ${razorpayPayment.status}`,
      });
    }

    // Step 4: Verify the order ID matches
    if (razorpayPayment.order_id !== razorpayOrderId) {
      return res.status(400).json({
        success: false,
        message: 'Payment order ID mismatch',
      });
    }

    // Get product details (for price calculation only)
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const productPrice = product.discountPrice || product.price;
    const subtotal = productPrice * quantity;
    const tax = 0; // Tax included in price
    const totalAmount = subtotal + shippingCharge + tax;
    const expectedAmountInPaise = Math.round(totalAmount * 100);

    // Step 5: Verify the amount matches
    if (razorpayPayment.amount !== expectedAmountInPaise) {
      console.error(`Amount mismatch: Expected ${expectedAmountInPaise}, Got ${razorpayPayment.amount}`);
      return res.status(400).json({
        success: false,
        message: 'Payment amount mismatch',
      });
    }

    // Check for duplicate order (idempotency)
    const existingOrder = await Order.findOne({
      'payment.razorpayPaymentId': razorpayPaymentId
    });
    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: 'Order already exists',
        data: existingOrder,
      });
    }

    // ATOMIC stock deduction - prevents race conditions
    // This operation checks stock >= quantity AND decrements in a single atomic operation
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        stock: { $gte: quantity }  // Only update if sufficient stock
      },
      {
        $inc: { stock: -quantity }  // Atomically decrement stock
      },
      {
        new: true  // Return the updated document
      }
    );

    // If no document was updated, stock was insufficient
    if (!updatedProduct) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock - product may have been purchased by another customer',
      });
    }

    // Create order (stock already deducted atomically)
    let order;
    try {
      order = await Order.create({
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
        },
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          pincode: shippingAddress.pincode,
        },
        product: {
          productId: updatedProduct._id,
          name: updatedProduct.name,
          price: productPrice,
          quantity,
          image: updatedProduct.images[0]?.url,
        },
        payment: {
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          method: 'razorpay',
          type: razorpayPayment.method || 'other',
          status: 'completed',
        },
        subtotal,
        shippingCharge,
        tax,
        totalAmount,
        orderStatus: 'confirmed',
        notes: courierName ? `Shipping via ${courierName}` : '',
      });
    } catch (orderError) {
      // If order creation fails, restore the stock
      await Product.findByIdAndUpdate(productId, {
        $inc: { stock: quantity }
      });
      throw orderError;
    }

    // Send order confirmation email (async, don't wait)
    sendOrderConfirmationEmail(order).catch(err => {
      console.error('Failed to send order confirmation email:', err.message);
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      search,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (paymentStatus) {
      query['payment.status'] = paymentStatus;
    }

    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message,
    });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private/Admin
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('product.productId');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message,
    });
  }
};

// @desc    Get order by order ID
// @route   GET /api/orders/track/:orderId
// @access  Public
const trackOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.json({
      success: true,
      data: {
        orderId: order.orderId,
        orderStatus: order.orderStatus,
        product: order.product,
        shippingAddress: order.shippingAddress,
        trackingNumber: order.trackingNumber,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message,
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    order.orderStatus = orderStatus;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (orderStatus === 'delivered') {
      order.deliveredAt = new Date();
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message,
    });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private/Admin
const cancelOrder = async (req, res) => {
  try {
    // Atomically update order status to cancelled (only if not already cancelled/shipped/delivered)
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        orderStatus: { $nin: ['shipped', 'delivered', 'cancelled'] }
      },
      {
        $set: { orderStatus: 'cancelled' }
      },
      {
        new: true
      }
    );

    if (!order) {
      // Check if order exists at all
      const existingOrder = await Order.findById(req.params.id);
      if (!existingOrder) {
        return res.status(404).json({
          success: false,
          message: 'Order not found',
        });
      }

      if (existingOrder.orderStatus === 'cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Order is already cancelled',
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is shipped or delivered',
      });
    }

    // Atomically restore product stock
    if (order.product?.productId) {
      await Product.findByIdAndUpdate(
        order.product.productId,
        { $inc: { stock: order.product.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message,
    });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message,
    });
  }
};

// @desc    Get monthly revenue data for chart
// @route   GET /api/orders/chart/revenue
// @access  Private/Admin
const getRevenueChartData = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();

    const revenueData = await Order.aggregate([
      {
        $match: {
          'payment.status': 'completed',
          createdAt: {
            $gte: new Date(currentYear, 0, 1),
            $lte: new Date(currentYear, 11, 31),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chartData = months.map((month, index) => {
      const found = revenueData.find((d) => d._id === index + 1);
      return {
        month,
        revenue: found ? found.revenue : 0,
      };
    });

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching revenue chart data',
      error: error.message,
    });
  }
};

// @desc    Get weekly orders data for chart
// @route   GET /api/orders/chart/weekly
// @access  Private/Admin
const getWeeklyOrdersChartData = async (req, res) => {
  try {
    // Get the start of the current week (Sunday)
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const ordersData = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: '$createdAt' },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chartData = days.map((day, index) => {
      const found = ordersData.find((d) => d._id === index + 1);
      return {
        day,
        orders: found ? found.orders : 0,
      };
    });

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly orders chart data',
      error: error.message,
    });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const confirmedOrders = await Order.countDocuments({ orderStatus: 'confirmed' });
    const shippedOrders = await Order.countDocuments({ orderStatus: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ orderStatus: 'cancelled' });

    const revenueResult = await Order.aggregate([
      { $match: { 'payment.status': 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching order statistics',
      error: error.message,
    });
  }
};

module.exports = {
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
};
