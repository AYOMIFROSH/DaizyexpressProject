const express = require('express');
const Stripe = require('stripe');
const PaymentDetails = require('../models/PaymentDetailsModel');

require('dotenv').config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);
const webHookSecret = process.env.WEB_HOOK_SECRET;

router.post(
    '/',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const sig = req.headers['stripe-signature'];
      
      try {
        const event = stripe.webhooks.constructEvent(req.body, sig, webHookSecret);
        
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          
          // If payment is not completed, skip processing.
          if (session.payment_status !== 'paid') {
            console.log('⚠️ Payment not completed, skipping processing');
            return res.status(200).send();
          }
  
          const paymentId = session.metadata.paymentId;
          
          // Update payment details: set activePlan true and PayedAt timestamp.
          await PaymentDetails.findByIdAndUpdate(
            paymentId,
            { activePlan: true, PayedAt: new Date() },
            { new: true }
          );
          
          // Immediately acknowledge receipt to Stripe.
          res.status(200).send();
          console.log(`✅ Payment ${paymentId} updated successfully.`);
        } else {
          // For other event types, just acknowledge.
          res.status(200).send();
        }
      } catch (error) {
        console.error('⛔ Webhook error:', error);
        res.status(error.statusCode || 500).send(error.message);
      }
    }
  );
  

module.exports = router;