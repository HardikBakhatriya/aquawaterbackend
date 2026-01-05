// @desc    Send contact form email using Brevo
// @route   POST /api/contact
// @access  Public
const sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
      });
    }

    const currentDate = new Date().toLocaleDateString('en-IN', {
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
    <title>New Contact Enquiry - ShreeFlow</title>
    <style>
        body {
            font-family: 'Inter', 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #fefefe;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
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
            font-size: 16px;
            font-weight: 500;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            color: #0284c7;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .message {
            color: #666;
            font-size: 16px;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .enquiry-details {
            background: #f0f9ff;
            border-left: 4px solid #0ea5e9;
            padding: 25px;
            border-radius: 8px;
            margin: 25px 0;
        }
        .detail-row {
            margin-bottom: 12px;
            display: flex;
        }
        .detail-label {
            font-weight: 600;
            color: #0284c7;
            min-width: 100px;
        }
        .detail-value {
            color: #333;
            flex: 1;
        }
        .customer-message {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #e9ecef;
            margin: 20px 0;
        }
        .message-label {
            font-weight: 600;
            color: #0284c7;
            margin-bottom: 10px;
            display: block;
        }
        .footer {
            background: #0284c7;
            color: white;
            padding: 25px;
            text-align: center;
            font-size: 14px;
        }
        .contact-info {
            margin: 15px 0;
            line-height: 1.6;
        }
        .highlight {
            color: #bae6fd;
            font-weight: 600;
        }
        .thank-you {
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 10px;
            border: 1px solid #0ea5e9;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">ShreeFlow</div>
            <div class="tagline">Smart Water Tank Solutions</div>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="greeting">Thank You for Contacting ShreeFlow!</div>

            <div class="thank-you">
                <p style="font-size: 18px; color: #0284c7; margin: 0;">
                    We appreciate your interest in our smart water tank solutions.
                    Our team will get back to you within 24 hours.
                </p>
            </div>

            <div class="message">
                We have received your enquiry and one of our representatives will contact you shortly
                to discuss your requirements in detail.
            </div>

            <!-- Enquiry Details -->
            <div class="enquiry-details">
                <h3 style="color: #0284c7; margin-top: 0; margin-bottom: 20px;">
                    Enquiry Summary
                </h3>

                <div class="detail-row">
                    <span class="detail-label">Name:</span>
                    <span class="detail-value">${name}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${phone || 'Not provided'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Subject:</span>
                    <span class="detail-value">${subject}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${currentDate}</span>
                </div>
            </div>

            <!-- Customer Message -->
            <div class="customer-message">
                <span class="message-label">Your Message:</span>
                <div style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            </div>

            <!-- Next Steps -->
            <div style="background: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
                <h4 style="color: #2E7D32; margin-top: 0;">What Happens Next?</h4>
                <ul style="color: #555; margin: 0; padding-left: 20px;">
                    <li>Our team will review your enquiry</li>
                    <li>We'll contact you to understand your specific requirements</li>
                    <li>Provide customized solutions for your water tank needs</li>
                    <li>Share product catalogs and pricing details</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div style="margin-bottom: 20px;">
                <strong>ShreeFlow</strong><br>
                <span class="highlight">Smart Water Tank Solutions</span>
            </div>

            <div class="contact-info">
                <div>Email: support@shreeflow.com</div>
                <div>Phone: +91 8168304716 | +91 9599268300</div>
                <div>Address: 28, Vijay Nagar, Indore, MP 452010</div>
            </div>

            <div style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                &copy; ${new Date().getFullYear()} ShreeFlow. All rights reserved.
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
            email: email,
            name: name,
          },
          {
            name: 'ShreeFlow Support',
            email: 'contact@swedhaessentials.com',
          },
        ],
        subject: `New Enquiry: ${subject}`,
        htmlContent: htmlContent,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error:', data);
      return res.status(500).json({
        success: false,
        message: 'Failed to send email. Please try again later.',
      });
    }

    res.json({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.',
      messageId: data.messageId,
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again.',
      error: error.message,
    });
  }
};

module.exports = {
  sendContactEmail,
};
