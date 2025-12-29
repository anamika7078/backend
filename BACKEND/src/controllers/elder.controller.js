const { Elder } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all elders
// @route   GET /api/elders
// @access  Private
exports.getElders = async (req, res, next) => {
    try {
        const elders = await Elder.findAll();
        res.status(200).json({ success: true, count: elders.length, data: elders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single elder
// @route   GET /api/elders/:id
// @access  Private
exports.getElder = async (req, res, next) => {
    try {
        const elder = await Elder.findByPk(req.params.id);
        if (!elder) {
            return next(new ErrorResponse('Elder not found', 404));
        }
        res.status(200).json({ success: true, data: elder });
    } catch (error) {
        next(error);
    }
};

// @desc    Create elder
// @route   POST /api/elders
// @access  Private
exports.createElder = async (req, res, next) => {
    try {
        const elder = await Elder.create(req.body);
        res.status(201).json({ success: true, data: elder });
    } catch (error) {
        next(error);
    }
};

// @desc    Update elder
// @route   PUT /api/elders/:id
// @access  Private
exports.updateElder = async (req, res, next) => {
    try {
        const elder = await Elder.findByPk(req.params.id);
        if (!elder) {
            return next(new ErrorResponse('Elder not found', 404));
        }
        await elder.update(req.body);
        res.status(200).json({ success: true, data: elder });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete elder
// @route   DELETE /api/elders/:id
// @access  Private
exports.deleteElder = async (req, res, next) => {
    try {
        const elder = await Elder.findByPk(req.params.id);
        if (!elder) {
            return next(new ErrorResponse('Elder not found', 404));
        }
        await elder.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
