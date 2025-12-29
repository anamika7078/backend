const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;
const ErrorResponse = require('../utils/errorResponse');

// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    // Get token from header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token
        req.user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });

        if (!req.user) {
            return next(new ErrorResponse('User not found', 404));
        }

        next();
    } catch (err) {
        console.error('JWT Error:', err);
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        const allowedRoles = roles.flat().map(role => role.toLowerCase());
        const userRole = req.user.role ? req.user.role.toLowerCase() : '';

        if (!allowedRoles.includes(userRole)) {
            return next(
                new ErrorResponse(
                    `User role ${req.user.role} is not authorized to access this route`,
                    403
                )
            );
        }
        next();
    };
};

exports.admin = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.toLowerCase() === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};