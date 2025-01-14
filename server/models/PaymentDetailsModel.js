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
        }
    ],
    bookingDetails: {
        recipientName: { type: String, required: true },
        serviceAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        additionalAddress: {
            recipientName: { type: String },
            serviceAddress: { type: String },
            city: { type: String },
            state: { type: String },
            zipCode: { type: String },
        },
        preferredServiceDate: { type: Date, required: true },
        preferredTime: { type: String }, 
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
    stripeSessionId: { type: String }, 
}, { timestamps: true });

const PaymentDetails = mongoose.model('PaymentDetails', PaymentDetailsSchema);
module.exports = PaymentDetails;
