// const { User, Caregiver } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const { Op } = require('sequelize');
const asyncHandler = require('../middleware/async');
// const ErrorResponse = require('../utils/errorResponse');
const db = require('../models');
const { User, Caregiver } = db;

// ... rest of your existing code ...
// @desc    Get all caregivers
// @route   GET /api/caregivers
// @access  Private/Admin
exports.getCaregivers = async (req, res, next) => {
    try {
        const caregivers = await Caregiver.findAll({
            include: [{
                model: User,
                as: 'caregiverUser',
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'profileImage']
            }],
            order: [['createdAt', 'DESC']]
        });

        // Format the response to include user data
        const formattedCaregivers = caregivers.map(caregiver => {
            // Ensure we have a valid caregiverUser object
            const user = caregiver.caregiverUser || {};

            return {
                id: caregiver.id,
                userId: caregiver.userId,
                name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User',
                email: user.email || 'No email',
                phone: user.phone || 'No phone',
                profileImage: user.profileImage,
                specialization: caregiver.specialization,
                experience: caregiver.experience,
                status: caregiver.status,
                availability: caregiver.availability,
                skills: caregiver.skills,
                dateOfBirth: caregiver.dateOfBirth,
                address: caregiver.address,
                city: caregiver.city,
                state: caregiver.state,
                zipCode: caregiver.zipCode,
                emergencyContact: caregiver.emergencyContact,
                emergencyPhone: caregiver.emergencyPhone,
                hourlyRate: caregiver.hourlyRate,
                languages: caregiver.languages,
                certifications: caregiver.certifications,
                createdAt: caregiver.createdAt,
                updatedAt: caregiver.updatedAt
            };
        });

        res.status(200).json({
            success: true,
            count: formattedCaregivers.length,
            data: formattedCaregivers
        });
    } catch (error) {
        console.error('Error fetching caregivers:', error);
        // Send a more detailed error response
        res.status(500).json({
            success: false,
            error: 'Failed to fetch caregivers',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};
// @desc    Create a new caregiver
// @route   POST /api/caregivers
// @access  Private/Admin
exports.createCaregiver = async (req, res, next) => {
    try {
        const {
            userId,
            specialization,
            experience,
            bio,
            availability,
            status,
            skills,
            dateOfBirth,
            address,
            city,
            state,
            zipCode,
            emergencyContact,
            emergencyPhone,
            hourlyRate,
            languages,
            certifications
        } = req.body;
        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        // Check if caregiver profile already exists for this user
        const existingCaregiver = await Caregiver.findOne({ where: { userId } });
        if (existingCaregiver) {
            return next(new ErrorResponse('Caregiver profile already exists for this user', 400));
        }
        // Create caregiver profile
        const caregiver = await Caregiver.create({
            userId,
            specialization,
            experience,
            bio,
            availability: availability || 'available', // Default to 'available' if not provided
            status: status || 'active', // Default to 'active' if not provided
            skills,
            dateOfBirth,
            address,
            city,
            state,
            zipCode,
            emergencyContact,
            emergencyPhone,
            hourlyRate,
            languages,
            certifications
        });
        res.status(201).json({
            success: true,
            data: caregiver
        });
    } catch (error) {
        console.error('Error in createCaregiver:', error);
        next(error);
    }
};
// @desc    Update caregiver
// @route   PUT /api/caregivers/:id
// @access  Private/Admin
// In caregiver.controller.js
// @desc    Update caregiver
// @route   PUT /api/caregivers/:id
// @access  Private/Admin
exports.updateCaregiver = asyncHandler(async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the caregiver with the associated user
        let caregiver = await Caregiver.findByPk(id, {
            include: [{
                model: User,
                as: 'caregiverUser',
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }]
        });

        if (!caregiver) {
            return next(new ErrorResponse('Caregiver not found', 404));
        }

        // Update user fields if they exist in the request
        if (req.body.firstName || req.body.lastName || req.body.email || req.body.phone) {
            await User.update(
                {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    phone: req.body.phone
                },
                { where: { id: caregiver.userId } }
            );
        }

        // Update caregiver fields
        const {
            specialization,
            experience,
            bio,
            availability,
            status,
            dateOfBirth,
            address,
            city,
            state,
            zipCode,
            emergencyContact,
            emergencyPhone,
            hourlyRate,
            languages,
            certifications
        } = req.body;

        await caregiver.update({
            specialization,
            experience,
            bio,
            availability,
            status,
            dateOfBirth,
            address,
            city,
            state,
            zipCode,
            emergencyContact,
            emergencyPhone,
            hourlyRate,
            languages,
            certifications
        });

        // Get the updated caregiver with user data
        const updatedCaregiver = await Caregiver.findByPk(id, {
            include: [{
                model: User,
                as: 'caregiverUser',
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone']
            }]
        });

        res.status(200).json({
            success: true,
            data: updatedCaregiver
        });

    } catch (error) {
        console.error('Update caregiver error:', error);
        next(error);
    }
});
// @desc    Delete caregiver
// @route   DELETE /api/caregivers/:id
// @access  Private/Admin
exports.deleteCaregiver = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the caregiver with associated user
        const caregiver = await Caregiver.findByPk(id, {
            include: [{
                model: User,
                as: 'caregiverUser'
            }]
        });

        if (!caregiver) {
            return next(new ErrorResponse('Caregiver not found', 404));
        }

        // Start a transaction
        const transaction = await Caregiver.sequelize.transaction();

        try {
            // Delete the caregiver record
            await caregiver.destroy({ transaction });

            // Also delete the associated user
            if (caregiver.caregiverUser) {
                await caregiver.caregiverUser.destroy({ transaction });
            }

            // Commit the transaction
            await transaction.commit();

            res.status(200).json({
                success: true,
                data: {}
            });

        } catch (error) {
            // Rollback the transaction in case of error
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        next(error);
    }
};
