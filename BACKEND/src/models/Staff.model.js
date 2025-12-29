module.exports = (sequelize, DataTypes) => {
    const Staff = sequelize.define('Staff', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        employeeId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: 'Employee ID is required'
                }
            }
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Date of birth is required'
                },
                isDate: true
            }
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Gender is required'
                },
                isIn: [['male', 'female', 'other']]
            }
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('address');
                return rawValue ? JSON.parse(rawValue) : {};
            },
            set(value) {
                this.setDataValue('address', JSON.stringify(value || {}));
            }
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Phone number is required'
                }
            }
        },
        emergencyContact: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('emergencyContact');
                return rawValue ? JSON.parse(rawValue) : {};
            },
            set(value) {
                this.setDataValue('emergencyContact', JSON.stringify(value || {}));
            }
        },
        hireDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                isDate: true,
                notEmpty: {
                    msg: 'Hire date is required'
                }
            }
        },
        position: {
            type: DataTypes.ENUM('caregiver', 'nurse', 'therapist', 'supervisor', 'admin'),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Position is required'
                }
            }
        },
        department: {
            type: DataTypes.STRING,
            allowNull: true
        },
        salary: {
            type: DataTypes.FLOAT,
            allowNull: true,
            validate: {
                min: 0
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        qualifications: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('qualifications');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('qualifications', JSON.stringify(value || []));
            }
        },
        skills: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('skills');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('skills', JSON.stringify(value || []));
            }
        },
        availability: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('availability');
                return rawValue ? JSON.parse(rawValue) : {
                    monday: { start: null, end: null, available: false },
                    tuesday: { start: null, end: null, available: false },
                    wednesday: { start: null, end: null, available: false },
                    thursday: { start: null, end: null, available: false },
                    friday: { start: null, end: null, available: false },
                    saturday: { start: null, end: null, available: false },
                    sunday: { start: null, end: null, available: false }
                };
            },
            set(value) {
                this.setDataValue('availability', JSON.stringify(value || {}));
            }
        },
        status: {
            type: DataTypes.ENUM('active', 'on-leave', 'suspended', 'terminated'),
            defaultValue: 'active',
            allowNull: false
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    }, {
        timestamps: true,
        tableName: 'Staff',
        indexes: [
            {
                fields: ['position', 'status']
            }
        ]
    });

    Staff.associate = (models) => {
        Staff.belongsToMany(models.Service, {
            through: 'StaffServices',
            foreignKey: 'staff_id',
            otherKey: 'service_id',
            as: 'services'
        });

        Staff.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'user'
        });
    };

    return Staff;
};