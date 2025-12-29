const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { checkEmail } = require('../controllers/user.controller');

// @route   GET /api/users/email/:email
// @desc    Check if email exists
// @access  Private
router.get('/email/:email', protect, checkEmail);

module.exports = router;
