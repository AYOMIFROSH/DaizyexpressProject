const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid'); 
const path = require('path');
const User = require('../models/userModel');
const UserVerification = require('../models/UserVerification');
const createError = require('../utils/appError');

require('dotenv').config();

const Secret_Key = process.env.SECRET_KEY;
const Auth_email = process.env.AUTH_EMAIL || 'taskzenreset@gmail.com';
const Auth_Password = process.env.AUTH_PASSWORD ;

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
        // const currentUrl = `http://localhost:${Port}/api/auth/verify/`;
        const currentUrl = `https://daizyexserver.vercel.app/api/auth/verify/`;
        const uniqueString = `${uuidv4()}${_id}`;
        const hashedUniqueString = await bcrypt.hash(uniqueString, 10);

        // Save to UserVerification collection
        const newVerification = new UserVerification({
            userId: _id,
            uniqueString: hashedUniqueString,
            createdAt: Date.now(),
            expiresAt: Date.now() + 6 * 60 * 60 * 1000, // 6 hours
        });

        await newVerification.save();

        // Email Options
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

        await transporter.sendMail(mailOptions);

        return { status: 'PENDING', message: 'Verification email sent!' };
    } catch (error) {
        console.error(error);
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
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return next(new createError('User already exists!', 400));
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await User.create({
            ...req.body,
            password: hashedPassword,
            verified: false,
        });

        // Send verification email
        const emailResponse = await sendVerificationEmail(newUser);

        res.status(201).json({
            status: emailResponse.status,
            message: emailResponse.message,
            user: {
                _id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role,
                verified: false,
            },
        });
    } catch (error) {
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
                email: user.email,
                role: user.role,
                verified: user.verified, // Make sure you send the verified status here

            },
        });
    } catch (error) {
        next(error);
    }
};
