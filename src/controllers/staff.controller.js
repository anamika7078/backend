const { Staff } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private/Admin
exports.getStaffMembers = async (req, res, next) => {
    try {
        const staff = await Staff.findAll();
        res.status(200).json({ success: true, count: staff.length, data: staff });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private/Admin
exports.getStaffMember = async (req, res, next) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if (!staff) {
            return next(new ErrorResponse('Staff member not found', 404));
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        next(error);
    }
};

// @desc    Create staff member
// @route   POST /api/staff
// @access  Private/Admin
exports.createStaffMember = async (req, res, next) => {
    try {
        const staff = await Staff.create(req.body);
        res.status(201).json({ success: true, data: staff });
    } catch (error) {
        next(error);
    }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private/Admin
exports.updateStaffMember = async (req, res, next) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if (!staff) {
            return next(new ErrorResponse('Staff member not found', 404));
        }
        await staff.update(req.body);
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private/Admin
exports.deleteStaffMember = async (req, res, next) => {
    try {
        const staff = await Staff.findByPk(req.params.id);
        if (!staff) {
            return next(new ErrorResponse('Staff member not found', 404));
        }
        await staff.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
