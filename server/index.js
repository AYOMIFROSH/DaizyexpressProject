const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');
const { Server } = require('socket.io');
const http = require('http');

const authRouter = require('./routes/authRoutes');
const fileRouter = require('./routes/fileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoute = require('./controllers/paymentController');

const app = express();
require('dotenv').config();

const dbAltHost = process.env.DB_ALT_HOST;

// MIDDLEWARES
const corsOptions = {
    origin: ['https://daizyexpress.vercel.app', 'http://localhost:5173'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions)); 
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
    mongoSanitize({
        onSanitize: ({ req, key }) => {
            console.warn(`This request contains a potentially malicious key: ${key}`);
        },
    })
);

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoute);  

app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs'); 

// General Global Error Handler
app.use((err, req, res, next) => {
    const allowedOrigins = ['https://daizyexpress.vercel.app', 'http://localhost:5173'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// Start the server
const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbAltHost, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            socketTimeoutMS: 45000,
            autoIndex: true,
        });
        console.log('Connected to MongoDB successfully');

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`App running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); 
    }
};

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});


startServer();
