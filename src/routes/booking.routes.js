const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Import controllers
const {
    createBooking,
    getBookings,
    getBooking,
    updateBooking,
    deleteBooking
} = require('../controllers/booking.controller');

// Apply auth middleware to all routes
router.use(protect);

// Define routes
router.route('/')
    .get(getBookings)
    .post(createBooking);

router.route('/:id')
    .get(getBooking)
    .put(updateBooking)
    .delete(deleteBooking);

module.exports = router;
