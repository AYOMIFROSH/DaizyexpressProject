const express = require('express');
const Stripe = require('stripe');
const PaymentDetails = require('../models/PaymentDetailsModel');
const User = require('../models/userModel');
const { authenticate } = require('../routes/middleware');
const notifyWebSocketServer = require('../utils/websocket.oihandler')
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');

require('dotenv').config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);
const webHookSecret = process.env.WEB_HOOK_SECRET;

const BASE_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.BASE_URL_PRODUCTION || 'https://daizyexserver.vercel.app' || 'https://websocket-oideizy.onrender.com'
        : process.env.BASE_URL_DEVELOPMENT || 'http://localhost:3000' || 'https://websocket-oideizy.onrender.com';

const FRONT_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.FRONT_URL_PRODUCTION || 'https://daizyexpress.vercel.app' || 'https://websocket-oideizy.onrender.com'
        : process.env.FRONT_URL_DEVELOPMENT || 'http://localhost:5173' || 'https://websocket-oideizy.onrender.com';

const Auth_email = process.env.AUTH_EMAIL || 'taskzenreset@gmail.com';
const Auth_Password = process.env.AUTH_PASSWORD || 'rhjlcwveeeaktiry';

// Create Payment Route
router.post('/card-payment', authenticate, async (req, res) => {
    console.log('create payment hit');
    console.log('Request Body:', req.body);

    const {
        selectedService,
        selectedAddOns,
        recipientName,
        serviceAddress,
        city,
        state,
        zipCode,
        recipientName_additional,
        serviceAddress_additional,
        city_additional,
        state_additional,
        zipCode_additional,
        serviceDate,
        preferredTime,
        paymentMethod,
        terms: termsAgreed,
        signature,
        totalPrice,
    } = req.body;

    // Validate required fields
    if (
        !selectedService || !selectedAddOns || !recipientName || !serviceAddress ||
        !city || !state || !zipCode || !serviceDate || !paymentMethod ||
        !termsAgreed || !signature || totalPrice === undefined
    ) {
        return res.status(400).json({ message: 'Payment Details not valid' });
    }

    const userId = req.user._id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Transform additional address
        const transformedAdditionalAddress = {
            recipientName: recipientName_additional || '',
            serviceAddress: serviceAddress_additional || '',
            city: city_additional || '',
            state: state_additional || '',
            zipCode: zipCode_additional || '',
        };

        const paymentDetails = new PaymentDetails({
            userId,
            serviceType: selectedService,
            addOns: selectedAddOns,
            bookingDetails: {
                recipientName,
                serviceAddress,
                city,
                state,
                zipCode,
                additionalAddresses: transformedAdditionalAddress,
                preferredServiceDate: new Date(serviceDate),
                preferredTime,
            },
            totalPrice,
            paymentMethod,
            termsAgreed,
            signature,
            activePlan: false,
        });

        const savedPayment = await paymentDetails.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: selectedService,
                            description: `Add-ons: ${selectedAddOns.join(', ')}`,
                        },
                        unit_amount: totalPrice * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${BASE_URL}/api/payment/verify-payment?paymentId=${savedPayment._id}`,
            cancel_url: `${FRONT_URL}/upload`,
            metadata: {
                paymentId: savedPayment._id.toString(),
                userId: userId.toString(),
            },
            
        },{ timeout: 10000 });

        // Save the Stripe session ID to your database
        savedPayment.stripeSessionId = session.id;
        await savedPayment.save();

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Failed to create payment session' });
    }
});

async function generatePDF(paymentDetails) {
    const browser = await puppeteer.launch({
        args: [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
        executablePath: process.env.NODE_ENV === 'production' ? await chromium.executablePath() : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: chromium.headless,
    });

    const page = await browser.newPage();
    const invoicePath = path.join(__dirname, '..', 'views', 'invoice.ejs');

    const html = await new Promise((resolve, reject) => {
        ejs.renderFile(invoicePath, { paymentDetails }, (err, str) => {
            if (err) reject(err);
            else resolve(str);
        });
    });

    await page.setContent(html);
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });

    await browser.close();

    paymentDetails.paidInvoice = { data: Buffer.from(pdfBuffer), contentType: 'application/pdf' };
    await paymentDetails.save();

    return pdfBuffer;
}

// Helper function to send email with PDF
async function sendInvoiceEmail(userEmail, userName, updatedPaymentDetails) {
    console.log('UserEmail: ', userEmail);
    console.log('UserName: ', userName);

    const transporter = nodemailer.createTransport({
        service: 'gmail', // Replace with your email service provider
        auth: {
            user: Auth_email,
            pass: Auth_Password,
        },
    });

    const mailOptions = {
        from: Auth_email,
        to: userEmail,
        subject: 'Your Payment Receipt',
        html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Payment Receipt</title>
        <style>
            body {
                font-family: 'Arial', sans-serif;
                color: #333;
                background-color: #f9f9f9;
                margin: 0;
                padding: 0;
            }
            .email-container {
                width: 100%;
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                border-bottom: 2px solid #444;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .header h1 {
                color: #2d3e50;
                font-size: 24px;
                margin: 0;
            }
            .header p {
                color: #777;
                font-size: 14px;
                margin: 5px 0;
            }
            .content {
                color: #333;
                font-size: 16px;
            }
            .content p {
                margin: 15px 0;
            }
            .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #777;
            }
            .footer p {
                margin: 5px 0;
            }
            .btn {
                display: inline-block;
                background-color: #4CAF50;
                color: #fff;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
            }
            .btn:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>Thank You for Your Payment</h1>
                <p>DaizyExpress - Official Payment Receipt</p>
            </div>
            <div class="content">
                <p>Dear ${userName},</p>
                <p>We are pleased to confirm the receipt of your payment. Thank you for choosing DaizyExpress!</p>
                <p>Your payment receipt is attached below. Please review the details in the attached invoice for full information.</p>
                <p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:support@daizyexpress.com">support@daizyexpress.com</a>.</p>
                <p>We appreciate your business and look forward to assisting you again soon.</p>
    
            </div>
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} DaizyExpress. All Rights Reserved.</p>
                <p>DaizyExpress | Your Trusted Partner in [Service Name]</p>
                <p><a href="mailto:support@daizyexpress.com">Contact Support</a></p>
            </div>
        </div>
    </body>
    </html>
    `,
        attachments: [
            {
                filename: `Invoice-${updatedPaymentDetails._id}.pdf`,
                content: updatedPaymentDetails.paidInvoice.data,
                contentType: updatedPaymentDetails.paidInvoice.contentType,
            },
        ],
    };

    await transporter.sendMail(mailOptions);
}

// Verification Route
router.get('/verify-payment', async (req, res) => {
    console.log('Verify payment hit');
    const { paymentId } = req.query;

    if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID is required' });
    }

    try {
        let paymentDetails = await PaymentDetails.findById(paymentId);
        if (!paymentDetails) {
            return res.status(404).json({ error: 'Payment details not found' });
        }

        const user = await User.findById(paymentDetails.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const session = await stripe.checkout.sessions.retrieve(paymentDetails.stripeSessionId);
        if (session.payment_status === 'paid') {
            await PaymentDetails.findByIdAndUpdate(paymentId, {
                activePlan: true,
                PayedAt: new Date(),
            });

            console.log(`Payment ${paymentId} verified and activated.`);

            res.redirect(`${FRONT_URL}/upload`);

            console.log('Generating Invoice & Sending Email...');
            await generatePDF(paymentDetails);
            console.log('sending generated Invoice')
            await sendInvoiceEmail(user.email, user.userName, paymentDetails);
            console.log('Invoice sent successfully.');
        } else {
            console.log(`Payment ${paymentId} not completed.`);
            return res.redirect(`${FRONT_URL}/upload`);
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});

// Webhook Route
router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const sig = req.headers['stripe-signature'];
  
      let event;
  
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, webHookSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
  
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object;
          const paymentId = session.metadata.paymentId;
  
          try {
            // Update the payment record (mark as active and set PayedAt)
            await PaymentDetails.findByIdAndUpdate(paymentId, {
              activePlan: true,
              PayedAt: new Date(),
            });
            console.log(`Payment ${paymentId} updated to active.`);
  
            // Re-fetch the updated payment details
            const updatedPaymentDetails = await PaymentDetails.findById(paymentId);
            const userId = updatedPaymentDetails.userId;
            const user = await User.findById(userId);
            if (!user) {
              return res.status(404).json({ error: 'User not found' });
            }
  
            // Fire-and-forget the heavy tasks (invoice generation & email)
            setImmediate(async () => {
              try {
                // Generate PDF using the updated payment details
                await generatePDF(updatedPaymentDetails);
                await sendInvoiceEmail(user.email, user.userName, updatedPaymentDetails);
                console.log('Invoice generated and email sent (via webhook).');
              } catch (err) {
                console.error('Error generating/sending invoice (webhook):', err);
                // Log the error without interrupting the webhook response.
              }
            });
  
            // Respond to Stripe promptly
            return res.status(200).send();
          } catch (error) {
            console.error('Error updating payment details in webhook:', error);
            return res.status(500).send();
          }
        }
        default:
          console.log(`Unhandled event type: ${event.type}`);
          return res.status(400).send('Unhandled event type');
      }
    }
  );

// PAYMENT FETCH MECHANISM

router.get('/active-payments', authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const activePayment = await PaymentDetails.findOne({ userId, activePlan: true }).select('-paidInvoice');

        if (activePayment) {
            // Notify WebSocket server
            notifyWebSocketServer('activePaymentsUpdated', { activePlan: true });

            res.status(200).json({ activePlan: true });
        } else {
            // Notify WebSocket server
            notifyWebSocketServer('activePaymentsUpdated', { activePlan: false });

            res.status(200).json({ activePlan: false });
        }
    } catch (error) {
        console.error('Error fetching active payments:', error);
        res.status(500).json({ error: 'Failed to fetch active payments' });
    }
});

// Get Active Plans
router.get('/active-plans', authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const activePayments = await PaymentDetails.find({ userId, activePlan: true }).select('-paidInvoice');

        if (activePayments.length > 0) {
            // Notify WebSocket server
            notifyWebSocketServer('activePlansUpdated', { activePlan: true, payments: activePayments });

            res.status(200).json({ activePlan: true, payments: activePayments });
        } else {
            // Notify WebSocket server
            notifyWebSocketServer('activePlansUpdated', { activePlan: false, payments: [] });

            res.status(200).json({ activePlan: false, payments: [] });
        }
    } catch (error) {
        console.error('Error fetching active payments:', error);
        res.status(500).json({ error: 'Failed to fetch active payments' });
    }
});

module.exports = router;
