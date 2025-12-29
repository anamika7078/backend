const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Create a new invoice
router.post('/', authenticate, invoiceController.createInvoice);

// Get all invoices (with optional filters)
router.get('/', authenticate, invoiceController.getAllInvoices);

// Get single invoice
router.get('/:id', authenticate, invoiceController.getInvoice);

// Update invoice status
router.patch('/:id/status', authenticate, authorize(['admin']), invoiceController.updateInvoiceStatus);

// Delete invoice
router.delete('/:id', authenticate, authorize(['admin']), invoiceController.deleteInvoice);

module.exports = router;
