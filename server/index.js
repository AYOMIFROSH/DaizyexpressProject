const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize');

const authRouter = require('./routes/authRoutes');
const fileRouter = require('./routes/fileRoutes')
const adminRoutes = require('./routes/adminRoutes');

const app = express();
require('dotenv').config();

const dbAltHost = process.env.DB_ALT_HOST;

// MIDDLEWARES
// Define CORS options
const corsOptions = {
    origin: 'https://daizyexpress.vercel.app',

    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Preflight request handling
app.options('*', cors(corsOptions));

// Body parsing middleware
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
app.use('/api/files', fileRouter)
app.use('/api/admin', adminRoutes);

app.set('views', path.join(__dirname, 'views'));  // Correct path to 'views' folder
app.set('view engine', 'ejs');  // Set EJS as view engine

// General Global Error Handler
app.use((err, req, res, next) => {
    // res.setHeader('Access-Control-Allow-Origin', 'https://daizyexpress.vercel.app');
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

// Async function to connect to MongoDB and start the server
const startServer = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbAltHost, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true, // Ensures indexes are created
        });
        console.log('Connected to MongoDB successfully');

        // Start the server only after the database connection is established
        const PORT = process.env.PORT || 3000; // Fallback for local testing
        app.listen(PORT, () => {
            console.log(`App running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1); // Exit the process with an error code
    }
};

// Call the async function to start the server
startServer();
