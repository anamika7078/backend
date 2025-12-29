const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Import controllers
const {
    getStaffMembers,
    getStaffMember,
    createStaffMember,
    updateStaffMember,
    deleteStaffMember
} = require('../controllers/staff.controller');

// Apply auth and admin middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Define routes
router.route('/')
    .get(getStaffMembers)
    .post(createStaffMember);

router.route('/:id')
    .get(getStaffMember)
    .put(updateStaffMember)
    .delete(deleteStaffMember);

module.exports = router;