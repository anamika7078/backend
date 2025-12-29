const { Payment, Booking } = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Process payment
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res, next) => {
    try {
        const { bookingId, amount, paymentMethodId } = req.body;

        // Verify booking exists
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return next(new ErrorResponse('Booking not found', 404));
        }

        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            payment_method: paymentMethodId,
            confirm: true,
            description: `Payment for booking #${bookingId}`,
            metadata: { bookingId: bookingId.toString() }
        });

        // Save payment record
        const payment = await Payment.create({
            userId: req.user.id,
            bookingId,
            amount,
            status: paymentIntent.status,
            paymentMethod: 'card',
            transactionId: paymentIntent.id,
            paymentDetails: JSON.stringify(paymentIntent)
        });

        res.status(201).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
exports.createPaymentIntent = async (req, res, next) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: { integration_check: 'accept_a_payment' }
        });

        res.status(200).json({
            success: true,
            data: { clientSecret: paymentIntent.client_secret }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
exports.getPayments = async (req, res, next) => {
    try {
        const payments = await Payment.findAll();
        res.status(200).json({ success: true, count: payments.length, data: payments });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res, next) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) {
            return next(new ErrorResponse('Payment not found', 404));
        }

        // Check if user is authorized to view this payment
        if (payment.userId !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to access this payment', 401));
        }

        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private/Admin
exports.updatePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) {
            return next(new ErrorResponse('Payment not found', 404));
        }

        await payment.update(req.body);
        res.status(200).json({ success: true, data: payment });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
exports.deletePayment = async (req, res, next) => {
    try {
        const payment = await Payment.findByPk(req.params.id);
        if (!payment) {
            return next(new ErrorResponse('Payment not found', 404));
        }

        await payment.destroy();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};
