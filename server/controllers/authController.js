const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/userModel');
const createError = require('../utils/appError')
require('dotenv').config();

const Secret_Key = process.env.SECRET_KEY;

// REGISTER USER
exports.signup = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(user){
            return next(new createError('User already exists!', 400));
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        const newUser = await  User.create({
            ...req.body, password: hashedPassword,
        });

        // Assign Json Web Token (JWT) 
        const token = jwt.sign({_id: newUser._id}, `${Secret_Key}`, {
            expiresIn: '1d',
        });

        res.status(201).json({
            status: 'sucess',
            message: 'User registerd successfully',
            token,
        })
    } catch (error) {
        next(error);
    }
};

exports.login = async () => {};