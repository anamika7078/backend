const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Import controllers
const {
    getElders,
    getElder,
    createElder,
    updateElder,
    deleteElder
} = require('../controllers/elder.controller');

// Apply auth middleware to all routes
router.use(protect);

// Define routes
router.route('/')
    .get(getElders)
    .post(createElder);

router.route('/:id')
    .get(getElder)
    .put(updateElder)
    .delete(deleteElder);

module.exports = router;
