const express = require('express');
const Stripe = require('stripe');
const PaymentDetails = require('../models/PaymentDetailsModel');
const User = require('../models/userModel');
const { authenticate } = require('../routes/middleware');
const notifyWebSocketServer = require('../utils/websocket.oihandler')
const puppeteer = require("puppeteer");
const nodemailer = require('nodemailer');

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
        });

        // Save the Stripe session ID to your database
        savedPayment.stripeSessionId = session.id;
        await savedPayment.save();

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Failed to create payment session' });
    }
});

async function generatePDF(paymentDetails, res) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = await new Promise((resolve, reject) => {
        res.render(`invoice`, { paymentDetails }, (err, renderedHtml) => {
            if (err) reject(err);
            else resolve(renderedHtml)
        })
    })
    await page.setContent(html);

    // Generate the PDF
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: false,
        scale: 0.8,
    });

    await browser.close();

    console.log(`PDF generated - size: ${pdfBuffer.length / 1024} KB`);

    // Save the PDF buffer to the paymentDetails document
    const pdfBufferAsBuffer = Buffer.from(pdfBuffer);

    paymentDetails.paidInvoice = {
        data: pdfBufferAsBuffer,
        contentType: 'application/pdf',
    };

    await paymentDetails.save();

    console.log('PDF saved to the database.');

    return pdfBufferAsBuffer;
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
        const paymentDetails = await PaymentDetails.findById(paymentId);
        if (!paymentDetails) {
            return res.status(404).json({ error: 'Payment details not found' });
        }

        const userId = paymentDetails.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const updatedPaymentDetails = await PaymentDetails.findById(paymentId);


        if (paymentDetails.activePlan == true) {
            console.log('plan is active')

            try {
                // Generate PDF and send the invoice
                 await generatePDF(updatedPaymentDetails, res);
                await sendInvoiceEmail( user.email, user.userName, updatedPaymentDetails);
            } catch (err) {
                console.error('Error generating/sending invoice:', err);
                // Log error, but do not halt the process
            }

            return res.redirect(`${FRONT_URL}/upload`);
        }
        const session = await stripe.checkout.sessions.retrieve(paymentDetails.stripeSessionId);
        if (session.payment_status === 'paid') {
            // Update the payment details with activePlan and PayedAt
            await PaymentDetails.findByIdAndUpdate(paymentId, {
                activePlan: true,
                PayedAt: new Date(),
            });

            console.log(`Payment ${paymentId} verified and activated.`);

            // Retrieve the updated payment details
            const updatedPaymentDetails = await PaymentDetails.findById(paymentId);

            try {
                // Generate PDF and send the invoice
                await generatePDF(updatedPaymentDetails, res);
                await sendInvoiceEmail(user.email, user.userName, updatedPaymentDetails);
            } catch (err) {
                console.error('Error generating/sending invoice:', err);
                // Log error, but do not halt the process
            }

            return res.redirect(`${FRONT_URL}/upload`);
        }

        console.log(`Payment ${paymentId} not completed.`);
        return res.redirect(`${FRONT_URL}/upload`);
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ error: 'Failed to verify payment' });
    }
});


// Webhook Route
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webHookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const paymentId = session.metadata.paymentId;

            try {
                await PaymentDetails.findByIdAndUpdate(paymentId, {
                    activePlan: true,
                    PayedAt: new Date(),
                });
                console.log(`Payment ${paymentId} completed successfully.`);

                const updatedPaymentDetails = await PaymentDetails.findById(paymentId);
                const userId = updatedPaymentDetails.userId;
                const user = await User.findById(userId);
                if (!user) {
                    return res.status(404).json({ error: 'User not found' });
                }

                try {
                    // Generate PDF and send the invoice
                    await generatePDF(updatedPaymentDetails, res);
                    await sendInvoiceEmail(user.email, user.userName, updatedPaymentDetails);
                } catch (err) {
                    console.error('Error generating/sending invoice:', err);
                    // Log error, but do not halt the process
                }
                res.status(200).send();
            } catch (error) {
                console.error('Error updating payment details:', error);
                res.status(500).send();
            }
            break;

        default:
            console.log(`Unhandled event type: ${event.type}`);
            res.status(400).send('Unhandled event type');
            break;
    }
});


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
