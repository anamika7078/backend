// BACKEND/src/controllers/auth.controller.js
const db = require('../models');
const User = db.User;

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, phone, role } = req.body;

    try {
        console.log('Registration attempt for:', email);

        // Validate required fields
        if (!firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'First name and last name are required'
            });
        }

        // Normalize role to proper case
        const normalizedRole = role ?
            role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() :
            'User';

        // Validate role
        const validRoles = ['User', 'Caregiver', 'Admin'];
        if (!validRoles.includes(normalizedRole)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role. Must be one of: ' + validRoles.join(', ')
            });
        }

        // Check if user exists
        const userExists = await db.User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Create user - password will be hashed by the beforeSave hook
        const user = await db.User.create({
            firstName,
            lastName,
            email,
            password: password, // Let the beforeSave hook handle hashing
            phone,
            role: normalizedRole
        });

        // Create token
        const token = user.getSignedJwtToken();

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        next(error);
    }
});
// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return next(new ErrorResponse('No user found with that email', 404));
        }

        // Generate reset token
        const resetToken = user.getResetPasswordToken();
        await user.save();

        // Create reset URL
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

        // TODO: Send email with reset URL
        console.log('Reset URL:', resetUrl);

        res.status(200).json({
            success: true,
            data: 'Email sent with password reset instructions'
        });
    } catch (err) {
        console.error('Forgot password error:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        return next(new ErrorResponse('Email could not be sent', 500));
    }
});

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    try {
        const user = await db.User.findOne({
            where: {
                resetPasswordToken,
                resetPasswordExpire: { [db.Sequelize.Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return next(new ErrorResponse('Invalid or expired token', 400));
        }

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Create token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error('Reset password error:', err);
        return next(new ErrorResponse('Password could not be reset', 500));
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    console.log('Login request body:', req.body);
    console.log('Login request headers:', req.headers);

    const { email, password } = req.body;

    if (!email || !password) {
        console.log('Missing credentials - email:', email, 'password:', password ? '***' : 'missing');
        return next(new ErrorResponse('Please provide an email and password', 400));
    }

    console.log('Login attempt for:', email);

    try {
        // Use the withPassword scope to include password field
        const user = await db.User.scope('withPassword').findOne({
            where: { email }
        });

        console.log('User found:', !!user);

        if (!user) {
            console.log('No user found with email:', email);
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if password exists (in case it's null/undefined)
        if (!user.password) {
            console.log('User has no password set:', email);
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        console.log('Stored password hash (first 20 chars):', user.password ? user.password.substring(0, 20) : 'null');
        console.log('Attempting password comparison...');

        let isMatch = false;
        try {
            isMatch = await user.matchPassword(password);
            console.log('Password match result:', isMatch);

            // If password doesn't match, it might be double-hashed (legacy issue)
            // Try comparing with a potential double-hash scenario
            if (!isMatch) {
                console.log('Initial password comparison failed. Checking for potential issues...');
                // The password might be stored incorrectly - this is just for debugging
                console.log('Password hash length:', user.password ? user.password.length : 0);
            }
        } catch (matchError) {
            console.error('Password comparison error:', matchError);
            return next(new ErrorResponse('Error validating password', 500));
        }

        if (!isMatch) {
            console.log('Password does not match for user:', email);
            return next(new ErrorResponse('Invalid credentials', 401));
        }

        // Check if JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return next(new ErrorResponse('Server configuration error', 500));
        }

        const token = user.getSignedJwtToken();
        console.log('Login successful for user:', email);
        console.log('User role:', user.role);

        const userResponse = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role
        };

        console.log('Sending response with user data:', userResponse);

        res.status(200).json({
            success: true,
            token,
            user: userResponse
        });
    } catch (error) {
        console.error('Login error:', error);
        next(error);
    }
});
// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] }
    });

    res.status(200).json({
        success: true,
        data: user
    });
});