module.exports = (sequelize, DataTypes) => {
    const Invoice = sequelize.define('Invoice', {
        invoiceNumber: {
            type: DataTypes.STRING,
            field: 'invoice_number',
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true
            }
        },
        userId: {
            type: DataTypes.INTEGER,
            field: 'user_id',
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        bookingId: {
            type: DataTypes.INTEGER,
            field: 'booking_id',
            allowNull: false,
            references: {
                model: 'Bookings',
                key: 'id'
            }
        },
        invoiceDate: {
            type: DataTypes.DATE,
            field: 'invoice_date',
            defaultValue: DataTypes.NOW,
            allowNull: false
        },
        dueDate: {
            type: DataTypes.DATEONLY,
            field: 'due_date',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        status: {
            type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled', 'refunded'),
            defaultValue: 'draft',
            allowNull: false
        },
        items: {
            type: DataTypes.TEXT,
            allowNull: false,
            get() {
                const rawValue = this.getDataValue('items');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('items', JSON.stringify(value || []));
            },
            validate: {
                isValidItems(value) {
                    try {
                        const items = typeof value === 'string' ? JSON.parse(value) : value;
                        if (!Array.isArray(items)) {
                            throw new Error('Items must be an array');
                        }
                    } catch (e) {
                        throw new Error('Invalid items format');
                    }
                }
            }
        },
        subtotal: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        tax: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        discount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        total: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
            validate: {
                min: 0
            }
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: 'USD',
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        termsAndConditions: {
            type: DataTypes.TEXT,
            field: 'terms_and_conditions',
            allowNull: true
        },
        paymentTerms: {
            type: DataTypes.ENUM('due_on_receipt', 'net_7', 'net_15', 'net_30', 'net_45', 'net_60'),
            field: 'payment_terms',
            defaultValue: 'due_on_receipt',
            allowNull: false
        },
        billingAddress: {
            type: DataTypes.TEXT,
            field: 'billing_address',
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('billingAddress');
                return rawValue ? JSON.parse(rawValue) : {};
            },
            set(value) {
                this.setDataValue('billingAddress', JSON.stringify(value || {}));
            }
        },
        sentAt: {
            type: DataTypes.DATE,
            field: 'sent_at',
            allowNull: true
        },
        paidAt: {
            type: DataTypes.DATE,
            field: 'paid_at',
            allowNull: true
        },
        reminderSentAt: {
            type: DataTypes.DATE,
            field: 'reminder_sent_at',
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('reminderSentAt');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('reminderSentAt', JSON.stringify(value || []));
            }
        }
    }, {
        timestamps: true,
        tableName: 'invoices',
        underscored: true,
        indexes: [
            { fields: ['user_id', 'status'] },
            { fields: ['invoice_number'], unique: true },
            { fields: ['due_date'] }
        ]
    });

    // Define associations
    Invoice.associate = (models) => {
        Invoice.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        Invoice.belongsTo(models.Booking, {
            foreignKey: 'booking_id',
            as: 'booking'
        });
        // Removed Payment association
    };

    // Instance method to format invoice number
    Invoice.prototype.getFormattedInvoiceNumber = function () {
        return `INV-${String(this.invoiceNumber).padStart(6, '0')}`;
    };

    // Hook to calculate totals before saving
    Invoice.beforeSave(async (invoice, options) => {
        if (invoice.items && invoice.items.length > 0) {
            // Calculate subtotal
            invoice.subtotal = invoice.items.reduce((sum, item) => sum + (item.amount || 0), 0);

            // Calculate total
            invoice.total = invoice.subtotal + (invoice.tax || 0) - (invoice.discount || 0);

            // Ensure total is not negative
            invoice.total = Math.max(0, invoice.total);
        }
    });

    return Invoice;
};