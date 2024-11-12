const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');

const app  = express();
require('dotenv').config();

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

//MIDDLEWARES
app.use(cors);
app.use(express.json());

//ROUTES
app.use('/api/auth', authRouter);

//MONGO DB CONNECTION
mongoose.connect(`${dbHost}/${dbName}`)
  .then(() => console.log('Connected to MongoDB!'))
  .catch((error) => console.error('Failed to connect to MongoDB:', error));

// General Global Handler
app.use((err, res, req, next)=> {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
});

//SERVERS
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`App running on ${PORT}`);
  })



