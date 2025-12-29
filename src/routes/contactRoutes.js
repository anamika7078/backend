const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect, admin } = require('../middleware/auth.middleware');

// Test route
router.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.status(200).json({ message: 'Test route is working!' });
});

// Public route - submit contact form
router.post('/', contactController.submitContactForm);

// Protected routes - require admin access
router.get('/', protect, admin, contactController.getContactMessages);

module.exports = router;