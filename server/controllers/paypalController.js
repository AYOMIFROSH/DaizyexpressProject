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
    ? process.env.FRONT_URL_PRODUCTION || 'https://daizyexpress.vercel.app'
    : process.env.FRONT_URL_DEVELOPMENT || 'http://localhost:5173';

// Create Payment Route for PayPal
router.post('/paypal-payment', authenticate, async (req, res) => {
  console.log('PayPal payment endpoint hit');
  console.log('Request Body:', req.body);

  // Destructure expected fields from request body
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
    !selectedService ||
    !selectedAddOns ||
    !recipientName ||
    !serviceAddress ||
    !city ||
    !state ||
    !zipCode ||
    !serviceDate ||
    !paymentMethod ||
    !termsAgreed ||
    !signature ||
    totalPrice === undefined
  ) {
    return res.status(400).json({ message: 'Payment Details not valid' });
  }

  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Transform additional address data
    const transformedAdditionalAddress = {
      recipientName: recipientName_additional || '',
      serviceAddress: serviceAddress_additional || '',
      city: city_additional || '',
      state: state_additional || '',
      zipCode: zipCode_additional || '',
    };

    // Create a new PaymentDetails record
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

    // Build PayPal order creation request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            // Ensure totalPrice is a string with 2 decimal places
            currency_code: 'USD',
            value: parseFloat(totalPrice).toFixed(2),
          },
          description: `Service: ${selectedService} | Add-ons: ${selectedAddOns.join(', ')}`,
          custom_id: savedPayment._id ? savedPayment._id.toString() : undefined, // Ensure this is set
          reference_id: savedPayment._id.toString(), // Backup reference        
        },
      ],
      application_context: {
        brand_name: 'Diezyexpress', // adjust as needed
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${BASE_URL}/api/paypal/paypal-success`, // Redirect here after payment approval
        cancel_url: `${FRONT_URL}/upload?cancelled=true`,
      },
    });

    // Execute the PayPal order creation
    const order = await client.execute(request);

    // Save the PayPal order ID to your payment record
    savedPayment.paypalOrderId = order.result.id;
    await savedPayment.save();

    // Extract the approval URL from the response links
    const approvalLink = order.result.links.find((link) => link.rel === 'approve');
    if (!approvalLink) {
      return res.status(500).json({ error: 'Approval link not found in PayPal order' });
    }

    res.status(200).json({ url: approvalLink.href });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
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

        console.log(`🆔 purchaseUnit:`, JSON.stringify(purchaseUnit, null, 2));

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
        res.redirect(`${FRONT_URL}/upload?paymentSuccess=true`);
    } catch (error) {
        console.error("❌ Error capturing PayPal order:", error);
        res.status(500).send("Internal server error during payment capture");
    }
});


module.exports = router;
