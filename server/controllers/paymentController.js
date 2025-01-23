const express = require('express');
const Stripe = require('stripe');
const PaymentDetails = require('../models/PaymentDetailsModel');
const User = require('../models/userModel');
const { authenticate } = require('../routes/middleware');
const notifyWebSocketServer = require('../utils/websocket.oihandler')

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

// Create Payment Route
router.post('/card-payment', authenticate, async (req, res) => {
    console.log('create payment hit');
    const {
        selectedService,
        selectedAddOns,
        recipientName,
        serviceAddress,
        city,
        state,
        zipCode,
        additionalAddresses,
        serviceDate,
        preferredTime,
        paymentMethod,
        terms: termsAgreed,
        signature,
        totalPrice,
    } = req.body;

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

        const transformedAdditionalAddress = additionalAddresses?.[0] || null;

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
                additionalAddress: transformedAdditionalAddress,
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
                            name: selectedService, // Add selected service name
                            description: `Add-ons: ${selectedAddOns.join(', ')}`,
                        },
                        unit_amount: totalPrice * 100, // Convert total price to cents
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

// Verification Route
router.get('/verify-payment', async (req, res) => {
    console.log('Verify payment hit')
    const { paymentId } = req.query;

    if (!paymentId) {
        return res.status(400).json({ error: 'Payment ID is required' });
    }

    try {
        // Fetch payment details from the database
        const paymentDetails = await PaymentDetails.findById(paymentId);
        if (!paymentDetails) {
            return res.status(404).json({ error: 'Payment details not found' });
        }

        const userId = paymentDetails.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (paymentDetails.activePlan) {
            return res.redirect(`${FRONT_URL}/upload`);
        }

        // Use the stored Stripe session ID to verify payment
        const session = await stripe.checkout.sessions.retrieve(paymentDetails.stripeSessionId);
        if (session.payment_status === 'paid') {
            await PaymentDetails.findByIdAndUpdate(paymentId, {
                activePlan: true,
                PayedAt: new Date(),
            });

            console.log(`Payment ${paymentId} verified and activated.`);
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
        const activePayment = await PaymentDetails.findOne({ userId, activePlan: true });

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
        const activePayments = await PaymentDetails.find({ userId, activePlan: true });

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
