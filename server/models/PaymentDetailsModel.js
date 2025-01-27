const mongoose = require('mongoose');

const PaymentDetailsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    serviceType: {
        type: String,
        required: true,
    },
    addOns: [
        {
            type: String,
        },
    ],
    bookingDetails: {
        recipientName: { type: String, required: true },
        serviceAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        additionalAddresses: {
            recipientName: { type: String },
            serviceAddress: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
        },
        preferredServiceDate: { type: Date, required: true },
        preferredTime: {
            type: String,
            required: false,
            set: function (value) {
                // Convert and validate time to 12-hour AM/PM format
                const match = /^([0]?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i.test(value);
                if (!match) {
                    throw new Error('Invalid time format. Use "HH:MM AM/PM" format.');
                }
                return value.toUpperCase(); 
            },
        },
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    termsAgreed: {
        type: Boolean,
        required: true,
    },
    signature: {
        type: String,
        required: true,
    },
    activePlan: {
        type: Boolean,
        default: false,
    },
    PayedAt: {
        type: Date,
        default: null,
    },
    paidInvoice: {
        data: Buffer,
        contentType: String,
    },
    stripeSessionId: { type: String },
}, { timestamps: true });

const PaymentDetails = mongoose.model('PaymentDetails', PaymentDetailsSchema);
module.exports = PaymentDetails;
