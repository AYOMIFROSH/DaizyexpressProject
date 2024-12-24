const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to protect routes
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication failed!' });
    // console.log("Request Headers:", req.headers);

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Authentication failed!' });
        }
        console.log('Authenticated user:', user); 
        req.user = user;
        next();
    });
};


exports.verifyAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Authentication failed!' });

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Authentication failed!' });
        }
        req.user = user;

        // Check if the user is an admin for admin-specific routes
        if (req.path.includes('/admin') && user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admins only' });
        }

        next();
    });
};
