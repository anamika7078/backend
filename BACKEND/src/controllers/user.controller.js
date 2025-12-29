const db = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Check if email exists
// @route   GET /api/users/email/:email
// @access  Private
exports.checkEmail = asyncHandler(async (req, res, next) => {
    const { email } = req.params;

    try {
        const user = await db.User.findOne({ where: { email } });

        if (user) {
            return res.status(200).json({
                success: true,
                exists: true,
                message: 'Email already exists'
            });
        }

        return res.status(200).json({
            success: true,
            exists: false,
            message: 'Email is available'
        });
    } catch (error) {
        console.error('Error checking email:', error);
        return next(new ErrorResponse('Error checking email', 500));
    }
});
