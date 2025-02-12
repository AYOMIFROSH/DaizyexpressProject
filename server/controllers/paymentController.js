const express = require('express');
const Stripe = require('stripe');
const PaymentDetails = require('../models/PaymentDetailsModel');
const User = require('../models/userModel');
const { authenticate } = require('../routes/middleware');
const notifyWebSocketServer = require('../utils/websocket.oihandler')

require('dotenv').config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

const BASE_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.BASE_URL_PRODUCTION || 'https://daizyexserver.vercel.app' || 'https://websocket-oideizy.onrender.com'
        : process.env.BASE_URL_DEVELOPMENT || 'http://localhost:3000' || 'https://websocket-oideizy.onrender.com';

const FRONT_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.FRONT_URL_PRODUCTION || 'https://deizyexpress.com' || 'https://websocket-oideizy.onrender.com'
        : process.env.FRONT_URL_DEVELOPMENT || 'http://localhost:5173' || 'https://websocket-oideizy.onrender.com';


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
            success_url: `${FRONT_URL}/upload`,
            cancel_url: `${FRONT_URL}/upload`,
            metadata: {
                paymentId: savedPayment._id.toString(),
                userId: userId.toString(),
            },

        }, { timeout: 10000 });

        // Save the Stripe session ID to your database
        savedPayment.stripeSessionId = session.id;
        await savedPayment.save();

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Failed to create payment session' });
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
