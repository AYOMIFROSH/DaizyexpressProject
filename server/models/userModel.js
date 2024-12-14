const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role: {
        type: String,
        default: 'user',
    },
    password: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true, 
    },
    resetToken: {
        type: String, // Stores the hashed reset token
        default: null,
    },
    resetTokenExpiry: {
        type: Date, // Stores the expiry time of the reset token
        default: null,
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
