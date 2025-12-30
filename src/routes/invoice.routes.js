const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Debug log
console.log('Invoice controller methods:', Object.keys(invoiceController || {}));

// Test route without middleware
router.post('/test', (req, res) => {
    console.log('Test route hit');
    res.json({ success: true, message: 'Test route working' });
});

// Create a new invoice - temporarily remove auth middleware
router.post('/', (req, res) => {
    console.log('Create invoice route hit');
    invoiceController.createInvoice(req, res);
});

// Get all invoices
router.get('/', (req, res) => invoiceController.getAllInvoices(req, res));

// Get single invoice
router.get('/:id', (req, res) => invoiceController.getInvoice(req, res));

// Update invoice status
router.patch('/:id/status', (req, res) => invoiceController.updateInvoiceStatus(req, res));

// Delete invoice
router.delete('/:id', (req, res) => invoiceController.deleteInvoice(req, res));

module.exports = router;
// In both invoice.routes.js and invoice.controller.js
console.log('File loaded:', __filename);