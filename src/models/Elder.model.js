module.exports = (sequelize, DataTypes) => {
    const Elder = sequelize.define('Elder', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please add a full name'
                }
            }
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please add date of birth'
                }
            }
        },
        gender: {
            type: DataTypes.ENUM('male', 'female', 'other'),
            allowNull: false
        },
        bloodGroup: {
            type: DataTypes.ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
            allowNull: true
        },
        heightValue: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        heightUnit: {
            type: DataTypes.ENUM('cm', 'feet'),
            defaultValue: 'cm',
            allowNull: true
        },
        weightValue: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        weightUnit: {
            type: DataTypes.ENUM('kg', 'lbs'),
            defaultValue: 'kg',
            allowNull: true
        },
        medicalHistory: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('medicalHistory');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('medicalHistory', JSON.stringify(value || []));
            }
        },
        allergies: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('allergies');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('allergies', JSON.stringify(value || []));
            }
        },
        medications: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('medications');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('medications', JSON.stringify(value || []));
            }
        },
        emergencyContacts: {
            type: DataTypes.TEXT,
            allowNull: true,
            get() {
                const rawValue = this.getDataValue('emergencyContacts');
                return rawValue ? JSON.parse(rawValue) : [];
            },
            set(value) {
                this.setDataValue('emergencyContacts', JSON.stringify(value || []));
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
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        timestamps: true,
        tableName: 'Elders'
    });

    // Define associations
    Elder.associate = function (models) {
        Elder.belongsTo(models.User, { foreignKey: 'userId' });
        // Add other associations as needed
    };

    return Elder;
};
