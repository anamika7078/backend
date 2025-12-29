module.exports = (sequelize, DataTypes) => {
   const Caregiver = sequelize.define('Caregiver', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        specialization: {
            type: DataTypes.STRING,
            allowNull: true
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        availability: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        status: {
            type: DataTypes.ENUM('Active', 'Inactive', 'On Leave'),
            defaultValue: 'Active'
        },
        skills: {
            type: DataTypes.JSON,
            allowNull: true
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emergencyContact: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emergencyPhone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: true
        },
        hourlyRate: {
            type: DataTypes.FLOAT,
            allowNull: true
        },
        languages: {
            type: DataTypes.JSON,
            allowNull: true
        },
        certifications: {
            type: DataTypes.JSON,
            allowNull: true
        }
    }, {
        tableName: 'Caregivers',
        timestamps: true
    });
    Caregiver.associate = (models) => {
        Caregiver.belongsTo(models.User, {
            foreignKey: 'userId',
            as: 'caregiverUser'
        });
    };
    return Caregiver;
};
