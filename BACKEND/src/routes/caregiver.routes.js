const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');
const {
    getCaregivers,
    createCaregiver,
    updateCaregiver,
    deleteCaregiver
} = require('../controllers/caregiver.controller');

// Apply auth middleware to all routes
router.use(protect);

// @route   GET /api/caregivers
// @desc    Get all caregivers
// @access  Private/Admin
router.get('/', authorize('admin'), getCaregivers);

// @route   POST /api/caregivers
// @desc    Create a new caregiver
// @access  Private/Admin
router.post('/', authorize(['admin', 'caregiver']), createCaregiver);

// @route   PUT /api/caregivers/:id
// @desc    Update caregiver
// @access  Private/Admin
router.put('/:id', authorize('admin'), updateCaregiver);

// @route   DELETE /api/caregivers/:id
// @desc    Delete caregiver
// @access  Private/Admin
router.delete('/:id', authorize('admin'), deleteCaregiver);

module.exports = router;
