const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Import controllers
const {
    addFamilyMember,
    getFamilyMembers,
    updateFamilyMember,
    removeFamilyMember
} = require('../controllers/familyMember.controller');

// Apply auth middleware to all routes
router.use(protect);

// Routes for family members
router.route('/')
    .post(addFamilyMember);

router.route('/:id')
    .put(updateFamilyMember)
    .delete(removeFamilyMember);

// Route to get all family members for an elder
router.get('/elders/:elderId/family-members', getFamilyMembers);

module.exports = router;
