const express = require('express');
const authController = require('../controllers/authController');
const path = require('path');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { authenticate } = require('./middleware');

const router = express.Router();

// Signup - login - users routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/users', authenticate, authController.getAllUsers);

// Email verification route
router.get('/verify/:userId/:uniqueString', authController.verifyEmail);

// Forgot password route
router.post('/forgotpassword', authController.forgotPassword);

// Serve reset-password form or reset-success page based on token validity
router.get('/reset-password/:token', async (req, res) => {
    const { token } = req.params;

    try {
        // Find user with a valid token
        const user = await User.findOne({
            resetToken: { $exists: true },
            resetTokenExpiry: { $gt: Date.now() },
        });

        // Check if the token is invalid, expired, or already used
        if (!user || !(await bcrypt.compare(token, user.resetToken))) {
            return res.sendFile(path.join(__dirname, '../views/reset-success.html'));
        }

        // If the token is valid, render the reset-password form
        res.render('reset-password', { token });
    } catch (error) {
        console.error('Error verifying reset link:', error);
        res.status(500).json({ message: 'An error occurred. Please try again.' });
    }
});

// Handle password reset form submission
router.post('/reset-password/:token', authController.resetPassword);

module.exports = router;
