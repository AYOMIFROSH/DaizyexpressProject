const express = require('express');
const Stripe = require('stripe');
const PaymentDetails = require('../models/PaymentDetailsModel');
const User = require('../models/userModel');
const puppeteer = require("puppeteer-core");
const chromium = require("@sparticuz/chromium");
const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);
const webHookSecret = process.env.WEB_HOOK_SECRET;

// Add email credentials
const Auth_email = process.env.AUTH_EMAIL || 'taskzenreset@gmail.com';
const Auth_Password = process.env.AUTH_PASSWORD || 'rhjlcwveeeaktiry';

async function generatePDF(invoiceData) {
    let browser;
    try {
        browser = await puppeteer.launch({
            args: chromium.args.concat([
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage'
            ]),
            executablePath: process.env.NODE_ENV === 'production' 
                ? await chromium.executablePath()
                : puppeteer.executablePath(),
            headless: 'new'
        });

        const page = await browser.newPage();
        const invoicePath = path.join(__dirname, '..', 'views', 'invoice.ejs');

        const html = await ejs.renderFile(invoicePath, invoiceData);
        await page.setContent(html);
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        // Save PDF to database
        await PaymentDetails.findByIdAndUpdate(
            invoiceData.payment._id,
            { 
                paidInvoice: { 
                    data: Buffer.from(pdfBuffer), 
                    contentType: 'application/pdf' 
                } 
            }
        );

        return pdfBuffer;
    } finally {
        if (browser) await browser.close();
    }
}

// Helper function to send email with PDF
async function sendInvoiceEmail(userEmail, userName, updatedPaymentDetails) {

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

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webHookSecret);
        
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            
            // Critical validation checks
            if (session.payment_status !== 'paid') {
                console.log('⚠️ Payment not completed, skipping processing');
                return res.status(200).send(); // Still acknowledge receipt
            }

            const paymentId = session.metadata.paymentId;
            
            // 1. Process critical payment update first
            const payment = await PaymentDetails.findByIdAndUpdate(
                paymentId,
                { activePlan: true, PayedAt: new Date() },
                { new: true }
            ).lean();

            // 2. Immediately acknowledge receipt to Stripe
            res.status(200).send();

            // 3. Async processing after response
            const user = await User.findById(payment.userId).lean();
            if (!user) throw new Error('User not found');

            // Generate and save PDF
            await generatePDF({
                payment: payment,
                user: user,
                invoiceId: `INV-${payment._id.toString().slice(-6)}`,
                date: new Date().toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                })
            });

            // Send email with fresh PDF data
            await sendInvoiceEmail(user.email, user.userName, payment);

            console.log(`✅ Completed processing for payment ${paymentId}`);
        } else {
            res.status(200).send(); // Handle other events
        }
    } catch (error) {
        console.error('⛔ Webhook error:', error);
        res.status(error.statusCode || 500).send(error.message);
    }
});

module.exports = router;