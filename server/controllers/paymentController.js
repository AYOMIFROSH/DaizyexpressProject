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
        ? process.env.FRONT_URL_PRODUCTION || 'https://diezyexpress.vercel.app' || 'https://websocket-oideizy.onrender.com'
        : process.env.FRONT_URL_DEVELOPMENT || 'http://localhost:5173' || 'https://websocket-oideizy.onrender.com';


// In your paymentController.js (Stripe part)
router.post('/initiate-card-payment', authenticate, async (req, res) => {
    const { paymentId } = req.body;
    if (!paymentId) return res.status(400).json({ message: 'Payment ID is required' });
  
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
      const paymentDetails = await PaymentDetails.findById(paymentId);
      if (!paymentDetails) return res.status(404).json({ message: 'Payment details not found' });
      
      // Create Stripe session using paymentDetails info
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        customer_email: user.email,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: paymentDetails.serviceType,
                description: `Add-ons: ${paymentDetails.addOns.join(', ')}`,
              },
              unit_amount: paymentDetails.totalPrice * 100,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${FRONT_URL}/document`,
        cancel_url: `${FRONT_URL}/document`,
        metadata: {
          paymentId: paymentDetails._id.toString(),
          userId: userId.toString(),
        },
      }, { timeout: 10000 });
  
      // Save the Stripe session ID if needed
      paymentDetails.stripeSessionId = session.id;
      await paymentDetails.save();
      res.status(200).json({ url: session.url });
    } catch (error) {
      console.error('Error initiating card payment:', error);
      res.status(500).json({ message: 'Failed to initiate card payment', error: error.message });
    }
  });
  

// PAYMENT FETCH MECHANISM

router.get('/active-payments', authenticate, async (req, res) => {
    try {
        const userId = req.user._id;
        const activePayment = await PaymentDetails.findOne({ userId, isPending: true }).select('-paidInvoice');

        if (activePayment) {
            // Notify WebSocket server
            notifyWebSocketServer('activePaymentsUpdated', { hasPending: true });

            // Include the payment id (activePayment._id) in the response.
            res.status(200).json({ 
              hasPending: true,
              payment: { id: activePayment._id } 
            });
        } else {
            // Notify WebSocket server
            notifyWebSocketServer('activePaymentsUpdated', { hasPending: false });
            res.status(200).json({ hasPending: false });
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
        const activePayments = await PaymentDetails.find({ userId, isPending: true }).select('-paidInvoice');

        if (activePayments.length > 0) {
            // Notify WebSocket server
            notifyWebSocketServer('activePlansUpdated', { isPending: true, payments: activePayments });

            res.status(200).json({ isPending: true, payments: activePayments });
        } else {
            // Notify WebSocket server
            notifyWebSocketServer('activePlansUpdated', { isPending: false, payments: [] });

            res.status(200).json({ isPending: false, payments: [] });
        }
    } catch (error) {
        console.error('Error fetching active payments:', error);
        res.status(500).json({ error: 'Failed to fetch active payments' });
    }
});


router.post('/create-pending', authenticate, async (req, res) => {
    console.log('Create Pending Hit');
    console.log(req.body);

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

    // Helper function to convert ISO time to 12-hour AM/PM format
    const convertTo12HourFormat = (isoTime) => {
        const date = new Date(isoTime);
        let hours = date.getHours();
        let minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    };

    let formattedPreferredTime;
    try {
        formattedPreferredTime = convertTo12HourFormat(preferredTime);
    } catch (e) {
        return res.status(400).json({ message: "Invalid preferredTime value." });
    }

    try {
        // Verify the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prepare additional address data if provided (or default to empty strings)
        const transformedAdditionalAddress = {
            recipientName: recipientName_additional || '',
            serviceAddress: serviceAddress_additional || '',
            city: city_additional || '',
            state: state_additional || '',
            zipCode: zipCode_additional || '',
        };

        // Create a new PaymentDetails document using the converted preferred time
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
                preferredTime: formattedPreferredTime,
            },
            totalPrice,
            paymentMethod,
            termsAgreed,
            signature,
            isPending: true,
            activePlan: false,
        });

        await paymentDetails.save();
        res.status(200).json({ paymentId: paymentDetails._id });
    } catch (error) {
        console.error('Error creating pending payment:', error);
        res.status(500).json({ message: error.message || 'Failed to create pending payment' });
    }
});

module.exports = router;
