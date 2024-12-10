const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/authRoutes');

const app = express();
require('dotenv').config();

const dbAltHost = process.env.DB_ALT_HOST;

// MIDDLEWARES
    // origin: 'http://localhost:5173', 

// Define CORS options
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://daizyexpress.vercel.app',
      'https://www.daizyexpress.vercel.app',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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

// Define a root route
app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

// ROUTES
app.use('/api/auth', authRouter);

// MONGO DB ATLAS COMPASS CONNECTION
mongoose.connect(dbAltHost, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDb Cluster');
})
.catch((error) => {
  console.error('Failed to connect to MongoDb Atlas Cluster', error);
});

// General Global Handler
app.use((err, req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://daizyexpress.vercel.app');
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// SERVERS (on Vercel, use process.env.PORT)
const PORT = process.env.PORT || 3000; // Fallback for local testing
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
