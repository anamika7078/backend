const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();
// Import routes
const authRoutes = require('./routes/auth.routes');
const bookingRoutes = require('./routes/booking.routes');
const adminRoutes = require('./routes/admin.routes');
const elderRoutes = require('./routes/elder.routes');
const serviceRoutes = require('./routes/service.routes');
const staffRoutes = require('./routes/staff.routes');
const documentRoutes = require('./routes/document.routes');
const caregiverRoutes = require('./routes/caregiver.routes');
const familyMemberRoutes = require('./routes/familyMember.routes');
const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/user.routes');
const invoiceRoutes = require('./routes/invoice.routes');

// Initialize express app
const app = express();

// CORS Configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = ['http://localhost:3000'];
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200
};

// Enable CORS with options
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Add CORS headers to all responses
app.use((req, res, next) => {
    // Remove the wildcard and set the specific origin
    const origin = req.headers.origin;
    if (origin && origin.includes('localhost:3000')) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/elders', elderRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/caregivers', caregiverRoutes);
app.use('/api/family-members', familyMemberRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/invoices', invoiceRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    console.error('Error stack:', err.stack);

    // Handle ErrorResponse instances
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { error: err.stack })
    });
});

module.exports = app;
