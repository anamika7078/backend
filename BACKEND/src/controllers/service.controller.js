const { Service } = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
exports.getServices = async (req, res, next) => {
    try {
        const services = await Service.findAll();
        res.status(200).json({ success: true, count: services.length, data: services });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
exports.getService = async (req, res, next) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return next(new ErrorResponse('Service not found', 404));
        }
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Create service
// @route   POST /api/services
// @access  Private/Admin
exports.createService = async (req, res, next) => {
    try {
        const service = await Service.create(req.body);
        res.status(201).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private/Admin
exports.updateService = async (req, res, next) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return next(new ErrorResponse('Service not found', 404));
        }
        await service.update(req.body);
        res.status(200).json({ success: true, data: service });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private/Admin
exports.deleteService = async (req, res, next) => {
    try {
        const service = await Service.findByPk(req.params.id);
        if (!service) {
            return next(new ErrorResponse('Service not found', 404));
        }
        await service.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
