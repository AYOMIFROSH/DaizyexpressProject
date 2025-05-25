const express = require('express');
const paypal = require('@paypal/checkout-server-sdk');
const PaymentDetails = require('../models/PaymentDetailsModel');
const User = require('../models/userModel');
const { authenticate } = require('../routes/middleware');
require('dotenv').config();

const router = express.Router();

// Setup PayPal environment (Sandbox for development, Live for production)
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_SANDBOX_CLIENT_ID,
    process.env.PAYPAL_SANDBOX_CLIENT_SECRET
  );
const client = new paypal.core.PayPalHttpClient(environment);  

// Define your front-end URL (for redirects after payment approval or cancellation)
const BASE_URL =
    process.env.NODE_ENV === 'production'
        ? process.env.BASE_URL_PRODUCTION || 'https://daizyexserver.vercel.app'
        : process.env.BASE_URL_DEVELOPMENT || 'http://localhost:3000';

const FRONT_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.FRONT_URL_PRODUCTION || 'https://diezyexpress.vercel.app'
    : process.env.FRONT_URL_DEVELOPMENT || 'http://localhost:5173';


router.post('/initiate-paypal-payment', authenticate, async (req, res) => {
  const { paymentId } = req.body;
  if (!paymentId) return res.status(400).json({ message: 'Payment ID is required' });

  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
    }

    const paymentDetails = await PaymentDetails.findById(paymentId);
    if (!paymentDetails) return res.status(404).json({ message: 'Payment details not found' });
    
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: parseFloat(paymentDetails.totalPrice).toFixed(2),
          },
          description: `Service: ${paymentDetails.serviceType} | Add-ons: ${paymentDetails.addOns.join(', ')}`,
          custom_id: paymentDetails._id.toString(),
          reference_id: paymentDetails._id.toString(),
        },
      ],
      application_context: {
        brand_name: 'Deizyexpress',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${BASE_URL}/api/paypal/paypal-success`,
        cancel_url: `${FRONT_URL}/payment-cancel`,
      },
    });

    const order = await client.execute(request);
    paymentDetails.paypalOrderId = order.result.id;
    await paymentDetails.save();

    const approvalLink = order.result.links.find(link => link.rel === 'approve');
    if (!approvalLink) return res.status(500).json({ message: 'Approval link not found' });

    res.status(200).json({ url: approvalLink.href });
  } catch (error) {
    console.error('Error initiating PayPal payment:', error);
    res.status(500).json({ message: 'Failed to initiate PayPal payment', error: error.message });
  }
});


// ------------------------------------------------------------------
// New Endpoint: Capture the PayPal order and update payment record
// ------------------------------------------------------------------
router.get('/paypal-success', async (req, res) => {
    console.log('✅ PayPal success endpoint hit');

    // PayPal returns a query parameter "token" which is the order ID.
    const { token } = req.query;
    if (!token) {
        return res.status(400).send("❌ Missing token (PayPal order ID)");
    }

    try {
        console.log(`🔄 Capturing PayPal order: ${token}`);

        // Create a request to capture the PayPal order.
        const captureRequest = new paypal.orders.OrdersCaptureRequest(token);
        captureRequest.requestBody({});

        // Execute the capture request.
        const captureResponse = await client.execute(captureRequest);

        // console.log("📄 PayPal Capture Response:", JSON.stringify(captureResponse.result, null, 2));

        // Check if the payment was completed
        if (captureResponse.result.status !== 'COMPLETED') {
            console.log("❌ Payment not completed");
            return res.status(400).send("Payment not completed");
        }

        // Retrieve the payment record ID from the custom_id field in purchase_units.
        const purchaseUnit = captureResponse.result.purchase_units[0];

        // Debugging: Check if `custom_id` exists
        if (!purchaseUnit) {
            console.log("❌ purchase_units is missing in response");
            return res.status(400).send("Missing purchase_units in PayPal response");
        }

        // console.log(`🆔 purchaseUnit:`, JSON.stringify(purchaseUnit, null, 2));

        let paymentId = purchaseUnit.custom_id || purchaseUnit.reference_id; // Fallback to reference_id
        if (!paymentId) {
            console.log("❌ Missing Payment record ID in order");
            return res.status(400).send("Missing Payment record ID in order");
        }

        console.log(`✅ Found Payment ID: ${paymentId}`);

        // Update the PaymentDetails document:
        // - Set activePlan to true.
        // - Set PayedAt to the current timestamp.
        const updatedPayment = await PaymentDetails.findByIdAndUpdate(paymentId, {
            activePlan: true,
            PayedAt: new Date(),
        });

        if (!updatedPayment) {
            console.log(`❌ Failed to update payment record for ID: ${paymentId}`);
            return res.status(500).send("Failed to update payment record");
        }

        console.log(`✅ Payment record updated successfully: ${paymentId}`);

        // Redirect the user to the front-end with a success flag.
        res.redirect(`${FRONT_URL}/document?paymentSuccess=true`);
    } catch (error) {
        console.error("❌ Error capturing PayPal order:", error);
        res.status(500).send("Internal server error during payment capture");
    }
});


module.exports = router;
