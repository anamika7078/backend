const db = require('../models');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Add a new family member
// @route   POST /api/family-members
// @access  Private
const addFamilyMember = async (req, res, next) => {
    try {
        console.log('Request body:', req.body);
        const { userId, elderId, relationship, permissions } = req.body;

        // Validate required fields
        if (!userId || !elderId || !relationship) {
            console.error('Missing required fields:', { userId, elderId, relationship });
            return next(new ErrorResponse('Please provide userId, elderId, and relationship', 400));
        }

        // Prevent user from adding themselves as their own family member
        if (parseInt(userId) === parseInt(elderId)) {
            return next(new ErrorResponse('User cannot be added as their own family member', 400));
        }

        // Check if user and elder exist
        const user = await db.User.findByPk(userId);
        const elder = await db.Elder.findByPk(elderId);

        if (!user || !elder) {
            console.error('User or Elder not found:', { userId, elderId });
            return next(new ErrorResponse('User or Elder not found', 404));
        }

        // Check if the relationship already exists
        const existingRelationship = await db.FamilyMember.findOne({
            where: { userId, elderId }
        });

        if (existingRelationship) {
            console.error('Relationship already exists:', { userId, elderId });
            return next(new ErrorResponse('This family relationship already exists', 400));
        }

        // Create the family member relationship
        const familyMemberData = {
            userId,
            elderId,
            relationship,
            ...(permissions || {})
        };

        console.log('Creating family member with data:', familyMemberData);

        const familyMember = await db.FamilyMember.create(familyMemberData);

        console.log('Family member created successfully:', familyMember);

        res.status(201).json({
            success: true,
            data: familyMember
        });
    } catch (error) {
        console.error('Error in addFamilyMember:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            ...(error.errors && { errors: error.errors.map(e => e.message) })
        });
        next(error);
    }
};

// @desc    Get all family members for an elder
// @route   GET /api/elders/:elderId/family-members
// @access  Private
const getFamilyMembers = async (req, res, next) => {
    try {
        const { elderId } = req.params;

        const familyMembers = await FamilyMember.findAll({
            where: { elderId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'phone']
                }
            ]
        });

        res.status(200).json({
            success: true,
            count: familyMembers.length,
            data: familyMembers
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update family member permissions
// @route   PUT /api/family-members/:id
// @access  Private
const updateFamilyMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isPrimary, canViewMedical, canEditProfile, canBookServices } = req.body;

        const familyMember = await FamilyMember.findByPk(id);
        if (!familyMember) {
            return next(new ErrorResponse('Family member not found', 404));
        }

        // Update only the allowed fields
        const updatedFields = {};
        if (isPrimary !== undefined) updatedFields.isPrimary = isPrimary;
        if (canViewMedical !== undefined) updatedFields.canViewMedical = canViewMedical;
        if (canEditProfile !== undefined) updatedFields.canEditProfile = canEditProfile;
        if (canBookServices !== undefined) updatedFields.canBookServices = canBookServices;

        await familyMember.update(updatedFields);

        res.status(200).json({
            success: true,
            data: familyMember
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Remove family member
// @route   DELETE /api/family-members/:id
// @access  Private
const removeFamilyMember = async (req, res, next) => {
    try {
        const familyMember = await FamilyMember.findByPk(req.params.id);
        if (!familyMember) {
            return next(new ErrorResponse('Family member not found', 404));
        }

        await familyMember.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addFamilyMember,
    getFamilyMembers,
    updateFamilyMember,
    removeFamilyMember
};
