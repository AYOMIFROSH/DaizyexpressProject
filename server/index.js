const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRouter = require('./routes/authRoutes');

const app = express();
require('dotenv').config();

const dbAltHost = process.env.DB_ALT_HOST;

// MIDDLEWARES

// Define CORS options
const corsOptions = {
    origin: 'http://localhost:5173', 
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
