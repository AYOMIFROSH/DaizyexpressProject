const mongoose = require('mongoose');

const UserVerificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        ref: 'User',
        required: true,
    },
    uniqueString: {
        type: String
    },
    createdAt: { type: Date, default: Date.now },
    expiresAt: {
        type: Date,
    },
    
});

const UserVerification = mongoose.model('UserVerification', UserVerificationSchema);
module.exports = UserVerification;