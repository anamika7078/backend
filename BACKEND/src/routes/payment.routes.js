const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');

// Import controllers
const {
    createPayment,
    getPayments,
    getPayment,
    updatePayment,
    deletePayment,
    createPaymentIntent
} = require('../controllers/payment.controller');

// Apply auth middleware to all routes
router.use(protect);

// Define routes
router.route('/')
    .get(getPayments)
    .post(createPayment);

router.route('/create-payment-intent')
    .post(createPaymentIntent);

router.route('/:id')
    .get(getPayment)
    .put(updatePayment)
    .delete(deletePayment);

module.exports = router;
