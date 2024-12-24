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
        type: String,
        default: null,
    },
    resetTokenExpiry: {
        type: Date,
        default: null,
    },
    fileUploadCount: {
        type: Number,
        default: 0, 
    },
    ProcessedDocument: {
        type: Number,
        default: 0, 
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
