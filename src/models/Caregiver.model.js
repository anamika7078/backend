// models/Caregiver.js
module.exports = (sequelize, DataTypes) => {
  const Caregiver = sequelize.define(
    'Caregiver',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      user_id: { // snake_case to match DB
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // lowercase table name
          key: 'id'
        }
      },

      specialization: { type: DataTypes.STRING, allowNull: true },
      experience: { type: DataTypes.INTEGER, allowNull: true },
      bio: { type: DataTypes.TEXT, allowNull: true },
      availability: { type: DataTypes.BOOLEAN, defaultValue: true },
      status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'On Leave'),
        defaultValue: 'Active'
      },
      skills: { type: DataTypes.JSON, allowNull: true },
      date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
      address: { type: DataTypes.STRING, allowNull: true },
      city: { type: DataTypes.STRING, allowNull: true },
      state: { type: DataTypes.STRING, allowNull: true },
      zip_code: { type: DataTypes.STRING, allowNull: true },
      emergency_contact: { type: DataTypes.STRING, allowNull: true },
      emergency_phone: { type: DataTypes.STRING, allowNull: true },
      profile_image: { type: DataTypes.STRING, allowNull: true },
      hourly_rate: { type: DataTypes.FLOAT, allowNull: true },
      languages: { type: DataTypes.JSON, allowNull: true },
      certifications: { type: DataTypes.JSON, allowNull: true }
    },
    {
      tableName: 'caregivers',
      timestamps: true,
      underscored: true,  // converts camelCase to snake_case automatically
      paranoid: true,     // soft deletes
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  );

  // Associations
  Caregiver.associate = (models) => {
    Caregiver.belongsTo(models.User, {
      foreignKey: 'user_id', // must match field above
      as: 'caregiverUser'
    });
  };

  return Caregiver;
};
