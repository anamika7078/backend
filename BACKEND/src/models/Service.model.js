module.exports = (sequelize, DataTypes) => {
    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'Please add a service name'
                }
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please add a description'
                }
            }
        },
        category: {
            type: DataTypes.ENUM(
                'personal-care',
                'medical',
                'companionship',
                'housekeeping',
                'transportation',
                'therapy',
                'other'
            ),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please add a category'
                }
            }
        },
        duration: {
            type: DataTypes.INTEGER, // in minutes
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please add a duration'
                },
                min: 1
            }
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please add a price'
                },
                min: 0
            }
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'USD'
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            field: 'is_active',  // Add this line
            allowNull: false,
            defaultValue: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        },
        requiresCaregiver: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        maxParticipants: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                min: 1
            }
        }
    }, {
        timestamps: true,
        tableName: 'services',
        underscored: true,
        indexes: [
            { fields: ['category'] },
            { fields: ['is_active'] }
        ]
    });

    // Define associations
    Service.associate = function (models) {
        Service.hasMany(models.Booking, {
            foreignKey: 'service_id',  // Use snake_case for foreign key
            as: 'bookings'
        });
    };
    Service.belongsToMany(models.Staff, {
        through: 'StaffServices',
        foreignKey: 'service_id',
        otherKey: 'staff_id',
        as: 'staff'
    });
    return Service;
};
