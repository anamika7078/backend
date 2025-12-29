
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

        // Check if user and elder exist
        const [user, elder] = await Promise.all([
            db.User.findByPk(userId),
            db.Elder.findByPk(elderId)
        ]);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }
        if (!elder) {
            return next(new ErrorResponse('Elder not found', 404));
        }

        // Check if the relationship already exists
        const existingRelationship = await db.FamilyMember.findOne({
            where: { userId, elderId }
        });

        if (existingRelationship) {
            return next(new ErrorResponse('This family relationship already exists', 400));
        }

        // Validate relationship type
        const validRelationships = ['spouse', 'child', 'sibling', 'parent', 'grandchild', 'friend', 'other'];
        if (!validRelationships.includes(relationship.toLowerCase())) {
            return next(new ErrorResponse('Invalid relationship type', 400));
        }

        // Create the family member relationship
        const familyMemberData = {
            userId,
            elderId,
            relationship: relationship.toLowerCase(),
            ...(permissions || {})
        };

        // Ensure only one primary family member per elder
        if (familyMemberData.isPrimary) {
            await db.FamilyMember.update(
                { isPrimary: false },
                { where: { elderId, isPrimary: true } }
            );
        }

        const familyMember = await db.FamilyMember.create(familyMemberData);

        res.status(201).json({
            success: true,
            data: familyMember
        });
    } catch (error) {
        console.error('Error in addFamilyMember:', error);
        next(new ErrorResponse('Failed to add family member', 500));
    }
};

// @desc    Get all family members for an elder
// @route   GET /api/elders/:elderId/family-members
// @access  Private
const getFamilyMembers = async (req, res, next) => {
    try {
        const { elderId } = req.params;

        // Check if elder exists
        const elder = await db.Elder.findByPk(elderId);
        if (!elder) {
            return next(new ErrorResponse('Elder not found', 404));
        }

        const familyMembers = await db.FamilyMember.findAll({
            where: { elderId },
            include: [
                {
                    model: db.User,
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
        console.error('Error in getFamilyMembers:', error);
        next(new ErrorResponse('Failed to fetch family members', 500));
    }
};

// @desc    Update family member permissions
// @route   PUT /api/family-members/:id
// @access  Private
const updateFamilyMember = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isPrimary, canViewMedical, canEditProfile, canBookServices, relationship } = req.body;

        const familyMember = await db.FamilyMember.findByPk(id);
        if (!familyMember) {
            return next(new ErrorResponse('Family member not found', 404));
        }

        // Update only the allowed fields
        const updatedFields = {};
        if (isPrimary !== undefined) updatedFields.isPrimary = isPrimary;
        if (canViewMedical !== undefined) updatedFields.canViewMedical = canViewMedical;
        if (canEditProfile !== undefined) updatedFields.canEditProfile = canEditProfile;
        if (canBookServices !== undefined) updatedFields.canBookServices = canBookServices;
        if (relationship) {
            const validRelationships = ['spouse', 'child', 'sibling', 'parent', 'grandchild', 'friend', 'other'];
            if (!validRelationships.includes(relationship.toLowerCase())) {
                return next(new ErrorResponse('Invalid relationship type', 400));
            }
            updatedFields.relationship = relationship.toLowerCase();
        }

        // If making primary, ensure no other primary exists
        if (updatedFields.isPrimary === true) {
            await db.FamilyMember.update(
                { isPrimary: false },
                {
                    where: {
                        elderId: familyMember.elderId,
                        id: { [db.Sequelize.Op.ne]: id } // Exclude current record
                    }
                }
            );
        }

        await familyMember.update(updatedFields);

        res.status(200).json({
            success: true,
            data: familyMember
        });
    } catch (error) {
        console.error('Error in updateFamilyMember:', error);
        next(new ErrorResponse('Failed to update family member', 500));
    }
};

// @desc    Remove family member
// @route   DELETE /api/family-members/:id
// @access  Private
const removeFamilyMember = async (req, res, next) => {
    try {
        const familyMember = await db.FamilyMember.findByPk(req.params.id);
        if (!familyMember) {
            return next(new ErrorResponse('Family member not found', 404));
        }

        await familyMember.destroy();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error in removeFamilyMember:', error);
        next(new ErrorResponse('Failed to remove family member', 500));
    }
};

module.exports = {
    addFamilyMember,
    getFamilyMembers,
    updateFamilyMember,
    removeFamilyMember
};