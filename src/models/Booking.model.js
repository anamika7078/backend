module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    'Booking',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false
      },

      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [10, 15],
            msg: 'Phone must be 10-15 digits'
          },
          isNumeric: {
            msg: 'Phone must contain only numbers'
          }
        }
      },

      service: {
        type: DataTypes.STRING,
        allowNull: false
      },

      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },

      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },

      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending'
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users', // must match real table name
          key: 'id'
        }
      },

      address: {
        type: DataTypes.STRING,
        allowNull: true
      },

      email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isEmail: true
        }
      },

      recurrence: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly', 'custom'),
        allowNull: true
      },

      customRecurrence: {
        type: DataTypes.STRING,
        allowNull: true
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    },
    {
      tableName: 'bookings',
      timestamps: true,
      paranoid: true,
      underscored: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  );

  // ---------- ASSOCIATIONS ----------
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
      onDelete: 'SET NULL'
    });
  };

  return Booking;
};
