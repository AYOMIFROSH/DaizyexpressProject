const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const mongoSanitize = require('express-mongo-sanitize');

const authRouter = require('./routes/authRoutes');
const fileRouter = require('./routes/fileRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoute = require('./controllers/paymentController');
const paypalPaymentRoute = require('./controllers/paypalController');
const webhookRouter = require('./controllers/webhookController');

const app = express();
require('dotenv').config();

const dbAltHost = process.env.DB_ALT_HOST;

// MIDDLEWARES
const corsOptions = {
    origin: ['https://daizyexpress.vercel.app', 'http://localhost:5173', 'https://websocket-oideizy.onrender.com'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions)); 
app.options('*', cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.use('/api/payment/webhook', webhookRouter);

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
app.use('/api/paypal', paypalPaymentRoute);

app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, '..', 'views')); 
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));


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

console.log(app._router.stack.map(r => r.route?.path).filter(Boolean));


// Start the server
const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbAltHost, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
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


// Call the startServer function to run the application
startServer();