// In invoice.controller.js
const { Invoice, Booking, User } = require('../models');
const { Op } = require('sequelize');

// Generate invoice number
const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(1000 + Math.random() * 9000);
    return `INV-${year}${month}-${random}`;
};

// Define controller methods
const createInvoice = async (req, res) => {
    console.log('createInvoice controller called');
    try {
        console.log('Request body:', req.body);
        const { clientName, clientEmail, clientAddress, items, notes, status, subtotal, tax, total, dueDate } = req.body;

        if (!items || !Array.isArray(items)) {
            console.error('Invalid items array');
            return res.status(400).json({
                success: false,
                message: 'Items array is required'
            });
        }

        const invoice = await Invoice.create({
            invoiceNumber: generateInvoiceNumber(),
            clientName,
            clientEmail,
            clientAddress,
            items: JSON.stringify(items),
            notes,
            status: status || 'draft',
            subtotal: parseFloat(subtotal) || 0,
            tax: parseFloat(tax) || 0,
            total: parseFloat(total) || 0,
            dueDate: dueDate || null,
            invoiceDate: new Date()
        });

        return res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Error in createInvoice:', error);
        return res.status(500).json({
            success: false,
            message: 'Error creating invoice',
            error: error.message
        });
    }
};

// Export each method individually
module.exports = {
    createInvoice,
    getAllInvoices: async (req, res) => {
        try {
            const invoices = await Invoice.findAll();
            return res.json({ success: true, data: invoices });
        } catch (error) {
            console.error('Error getting invoices:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting invoices',
                error: error.message
            });
        }
    },
    getInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findByPk(req.params.id);
            if (!invoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }
            return res.json({ success: true, data: invoice });
        } catch (error) {
            console.error('Error getting invoice:', error);
            return res.status(500).json({
                success: false,
                message: 'Error getting invoice',
                error: error.message
            });
        }
    },
    updateInvoiceStatus: async (req, res) => {
        try {
            const invoice = await Invoice.findByPk(req.params.id);
            if (!invoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }
            invoice.status = req.body.status;
            await invoice.save();
            return res.json({ success: true, data: invoice });
        } catch (error) {
            console.error('Error updating invoice status:', error);
            return res.status(500).json({
                success: false,
                message: 'Error updating invoice status',
                error: error.message
            });
        }
    },
    deleteInvoice: async (req, res) => {
        try {
            const invoice = await Invoice.findByPk(req.params.id);
            if (!invoice) {
                return res.status(404).json({
                    success: false,
                    message: 'Invoice not found'
                });
            }
            await invoice.destroy();
            return res.json({
                success: true,
                message: 'Invoice deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting invoice:', error);
            return res.status(500).json({
                success: false,
                message: 'Error deleting invoice',
                error: error.message
            });
        }
    }
};