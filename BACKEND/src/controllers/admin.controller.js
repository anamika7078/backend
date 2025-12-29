const { User, Caregiver } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Create user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res, next) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        await user.update(req.body);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        await user.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user stats
// @route   GET /api/admin/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res, next) => {
    try {
        const stats = await User.findAll({
            attributes: ['role'],
            group: ['role'],
            raw: true,
            nest: true
        });
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

// @desc    Add a new caregiver
// @route   POST /api/admin/caregivers
// @access  Private/Admin
exports.addCaregiver = async (req, res, next) => {
    try {
        const { userId, specialization, experience, availability, ...otherDetails } = req.body;

        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        // Create caregiver profile
        const caregiver = await Caregiver.create({
            userId,
            specialization,
            experience,
            availability,
            ...otherDetails
        });

        res.status(201).json({
            success: true,
            data: caregiver
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all caregivers
// @route   GET /api/admin/caregivers
// @access  Private/Admin
exports.getCaregivers = async (req, res, next) => {
    try {
        const caregivers = await Caregiver.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: caregivers.length,
            data: caregivers
        });
    } catch (error) {
        next(error);
    }
};
