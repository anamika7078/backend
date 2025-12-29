const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// Import controllers
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getUserStats,
    addCaregiver,
    getCaregivers
} = require('../controllers/admin.controller');

// Apply auth and admin middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Define routes
router.route('/users')
    .get(getUsers)
    .post(createUser);

router.route('/users/stats')
    .get(getUserStats);

router.route('/users/:id')
    .get(getUser)
    .put(updateUser)
    .delete(deleteUser);

// Caregiver routes
router.route('/caregivers')
    .post(addCaregiver)
    .get(getCaregivers);

module.exports = router;