const express = require('express');
const Stripe = require('stripe');
const PaymentDetails = require('../models/PaymentDetailsModel');
const User = require('../models/userModel');
const { authenticate } = require('../routes/middleware');

const router = express.Router();
const stripe = new Stripe('sk_test_51QbTinI80y0LOYtP4FRooidJslB1ezHZVMeESzDOy9oBfjBObItXsFIaRmJ09Y4S5K5CFZ7upChtykP1tvRN7K6h00RW3gLmom');
const webHookSecret = 'whsec_1Crpj2KkRa5GxUWMfz4kGZOoY9E9t6o9'; 

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
                          name: selectedService,
                      },
                      unit_amount: totalPrice * 100,
                  },
                  quantity: 1,
              },
          ],
          mode: 'payment',
          success_url: `http://localhost:3000/api/payment/verify-payment?paymentId=${savedPayment._id}`,
          cancel_url: `http://localhost:5173/upload`,
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
          return res.redirect(`http://localhost:5173/${user.role}`);
      }

      // Use the stored Stripe session ID to verify payment
      const session = await stripe.checkout.sessions.retrieve(paymentDetails.stripeSessionId);
      if (session.payment_status === 'paid') {
          await PaymentDetails.findByIdAndUpdate(paymentId, {
              activePlan: true,
              PayedAt: new Date(),
          });

          console.log(`Payment ${paymentId} verified and activated.`);
          return res.redirect(`http://localhost:5173/${user.role}`);
      }

      console.log(`Payment ${paymentId} not completed.`);
      return res.redirect('http://localhost:5173/upload');
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

// Get Active Payments
router.get('/active-payments', authenticate, async (req, res) => {
    try {
      const userId = req.user._id;
      const activePayment = await PaymentDetails.findOne({ userId, activePlan: true });
  
      if (activePayment) {
        res.status(200).json({ activePlan: true });
      } else {
        res.status(200).json({ activePlan: false });
      }
    } catch (error) {
      console.error('Error fetching active payments:', error);
      res.status(500).json({ error: 'Failed to fetch active payments' });
    }
  });


  router.get('/active-plans', authenticate, async (req, res) => {
    try {
      const userId = req.user._id;
      const activePayments = await PaymentDetails.find({ userId, activePlan: true });
  
      if (activePayments.length > 0) {
        res.status(200).json({ activePlan: true, payments: activePayments });
      } else {
        res.status(200).json({ activePlan: false, payments: [] });
      }
    } catch (error) {
      console.error('Error fetching active payments:', error);
      res.status(500).json({ error: 'Failed to fetch active payments' });
    }
  });
  
  

module.exports = router;
