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

// Create a new invoice
exports.createInvoice = async (req, res) => {
    try {
        const { bookingId, dueDate, items, notes } = req.body;

        // Calculate total amount
        const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

        const invoice = await Invoice.create({
            invoiceNumber: generateInvoiceNumber(),
            userId: req.user.id,
            bookingId,
            invoiceDate: new Date(),
            dueDate,
            status: 'draft',
            items: JSON.stringify(items),
            subtotal: totalAmount,
            tax: 0, // Add tax calculation if needed
            total: totalAmount,
            notes
        });

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Error creating invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating invoice',
            error: error.message
        });
    }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const { status, fromDate, toDate } = req.query;
        const where = {};

        if (status) where.status = status;
        if (fromDate && toDate) {
            where.invoiceDate = {
                [Op.between]: [new Date(fromDate), new Date(toDate)]
            };
        }

        const invoices = await Invoice.findAll({
            where,
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName', 'email'] },
                { model: Booking, attributes: ['id', 'serviceType', 'startDate', 'endDate'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            success: true,
            data: invoices
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoices',
            error: error.message
        });
    }
};

// Get single invoice
exports.getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id, {
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName', 'email', 'phone'] },
                {
                    model: Booking,
                    attributes: ['id', 'serviceType', 'startDate', 'endDate', 'totalHours', 'hourlyRate'],
                    include: [
                        { model: User, as: 'Caregiver', attributes: ['id', 'firstName', 'lastName'] }
                    ]
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Error fetching invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching invoice',
            error: error.message
        });
    }
};

// Update invoice status
exports.updateInvoiceStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const invoice = await Invoice.findByPk(id);
        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        invoice.status = status;
        await invoice.save();

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        console.error('Error updating invoice status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating invoice status',
            error: error.message
        });
    }
};

// Delete invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const invoice = await Invoice.findByPk(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Invoice not found'
            });
        }

        await invoice.destroy();

        res.status(200).json({
            success: true,
            message: 'Invoice deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting invoice:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting invoice',
            error: error.message
        });
    }
};
