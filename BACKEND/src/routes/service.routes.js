const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Import controllers
const {
    getServices,
    getService,
    createService,
    updateService,
    deleteService
} = require('../controllers/service.controller');

// Apply auth middleware to all routes
router.use(protect);

// Define routes
router.route('/')
    .get(getServices)
    .post(createService);

router.route('/:id')
    .get(getService)
    .put(updateService)
    .delete(deleteService);

module.exports = router;
