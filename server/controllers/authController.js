const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); 
const crypto = require('crypto');
const path = require('path');
const User = require('../models/userModel');
const UserVerification = require('../models/UserVerification');
const createError = require('../utils/appError');

require('dotenv').config();

const Secret_Key = process.env.SECRET_KEY;
const Auth_email = process.env.AUTH_EMAIL || 'taskzenreset@gmail.com';
const Auth_Password = process.env.AUTH_PASSWORD || 'rhjlcwveeeaktiry';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.BASE_URL_PRODUCTION || 'https://daizyexserver.vercel.app' 
    : process.env.BASE_URL_DEVELOPMENT || 'http://localhost:3000'; 

// NODEMAILER TRANSPORTER
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: Auth_email,
        pass: Auth_Password,
    },
});

// HELPER: SEND VERIFICATION EMAIL
const sendVerificationEmail = async ({ _id, email }) => {
    try {
        const currentUrl = `${BASE_URL}/api/auth/verify/`;
        const uniqueString = `${uuidv4()}${_id}`;
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

        await new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 6 * 60 * 60 * 1000,
        }).save();

        const mailOptions = {
            from: Auth_email,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <p>Verify your email address to complete the signup process.</p>
                <p>This link <b>expires in 6 hours</b>.</p>
                <a href="${currentUrl}${_id}/${uniqueString}">Click here to verify your email</a>
            `,
        };

        console.log("Sending email to:", email);
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");

        return { status: 'PENDING', message: 'Verification email sent!' };
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error('Failed to send verification email.');
    }
};

// VERIFY EMAIL ROUTE
exports.verifyEmail = async (req, res) => {
    const { userId, uniqueString } = req.params;

    try {
        const record = await UserVerification.findOne({ userId });

        if (!record) {
            return res.redirect(`/user/verified?error=true&message=Invalid or expired link.`);
        }

        if (record.expiresAt < Date.now()) {
            await UserVerification.deleteOne({ userId });
            await User.deleteOne({ _id: userId });
            return res.redirect(`/user/verified?error=true&message=Link expired. Please sign up again.`);
        }

        const isValid = await bcrypt.compare(uniqueString, record.uniqueString);
        if (!isValid) {
            return res.redirect(`/user/verified?error=true&message=Invalid verification details.`);
        }

        await User.updateOne({ _id: userId }, { verified: true });
        await UserVerification.deleteOne({ userId });

        res.sendFile(path.join(__dirname, '../views/verified.html'));
    } catch (error) {
        console.error(error);
        res.redirect(`/user/verified?error=true&message=Verification failed. Please try again.`);
    }
};

// VERIFIED PAGE ROUTE
exports.verifiedPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../views/verified.html'));
};

// REGISTER USER
exports.signup = async (req, res, next) => {
    try {
        console.log("Incoming signup request:", req.body);

        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            console.log("User already exists with email:", req.body.email);
            return next(new createError('User already exists!', 400));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
            verified: false,
        });

        console.log("User created, sending verification email...");
        const emailResponse = await sendVerificationEmail(newUser);

        console.log("Verification email sent:", emailResponse);

        res.status(201).json({
            status: emailResponse.status,
            message: emailResponse.message,
            user: {
                _id: newUser._id,
                userName: newUser.userName,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
                verified: false,
            },
        });
    } catch (error) {
        console.error("Signup error:", error.message);
        next(error);
    }
};

// LOGIN USER || ADMIN
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new createError('User not found!', 404));
        }

        if (!user.verified) {
            return res.status(401).json({
                status: 'FAILED',
                message: "Email hasn't been verified yet. Check your inbox.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return next(new createError('Incorrect email or password.', 401));
        }

        const token = jwt.sign({ _id: user._id }, Secret_Key, { expiresIn: '1d' });

        res.status(200).json({
            status: 'success',
            message: 'Logged in successfully.',
            token,
            user: {
                _id: user._id,
                userName: user.userName,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                verified: user.verified, 
                fileUploadCount: user.fileUploadCount,
                ProcessedDocument: user.ProcessedDocument

            },
        });
    } catch (error) {
        next(error);
    }
};


// Reset Password and Forgot password world

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist.' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);
        const resetTokenExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

        // Save hashed token to the user's record
        user.resetToken = hashedToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        // Send reset email
        const resetURL = `${BASE_URL || `${req.protocol}://${req.get('host')}`}/api/auth/reset-password/${resetToken}`;
        await transporter.sendMail({
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: 'Password Reset',
            html: `
                <p>Hi ${user.userName}</p>
                <p>We received a request to reset your password.</p>
                <p>Click the link below to reset your password:</p>
                <a href="${resetURL}">Reset Password</a>
                <p>This link expires in 10 minutes.</p>
            `,
        });

        res.status(200).json({ message: 'Password reset link has been sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending reset email. Please try again.' });
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    try {
        // Find user with a valid token and expiry
        const user = await User.findOne({
            resetToken: { $exists: true },
            resetTokenExpiry: { $gt: Date.now() },
        });

        // Validate token
        if (!user || !(await bcrypt.compare(token, user.resetToken))) {
            return res.sendFile(path.join(__dirname, '../views/reset-success.html'));
        }

        // Update the password and clear the reset token fields
        user.password = await bcrypt.hash(newPassword, 12);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        // Serve the reset-success HTML page
        res.status(200).sendFile(path.join(__dirname, '../views/reset-success.html'));
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Error resetting password. Please try again.' });
    }
};

// FETCH ALL USERS
exports.getAllUsers = async (req, res) => {

    const users = await User.find({});
    
    const userMap = {};
    users.forEach((user) => {
        userMap[user._id] = user;
    });
    
    res.send(userMap);
}    
  
