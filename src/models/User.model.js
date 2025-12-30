const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },

      profileImage: {
        type: DataTypes.STRING,
        allowNull: true
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'First name is required' },
          len: {
            args: [2, 50],
            msg: 'First name must be between 2 and 50 characters'
          }
        }
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Last name is required' },
          len: {
            args: [2, 50],
            msg: 'Last name must be between 2 and 50 characters'
          }
        }
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email already exists'
        },
        validate: {
          isEmail: { msg: 'Please provide a valid email' },
          notEmpty: { msg: 'Email is required' }
        }
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Password is required' },
          len: {
            args: [6],
            msg: 'Password must be at least 6 characters long'
          }
        }
      },

      phone: {
        type: DataTypes.STRING,
        validate: {
          isNumeric: {
            msg: 'Phone number should contain only numbers'
          },
          len: {
            args: [10, 15],
            msg: 'Phone number should be between 10 and 15 digits'
          }
        }
      },

      role: {
        type: DataTypes.ENUM('User', 'Caregiver', 'Admin'),
        allowNull: false,
        defaultValue: 'User'
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },

      lastLogin: {
        type: DataTypes.DATE
      },

      resetPasswordToken: {
        type: DataTypes.STRING
      },

      resetPasswordExpire: {
        type: DataTypes.DATE
      }
    },
    {
      tableName: 'users',
      timestamps: true,
      paranoid: true,
      underscored: true,

      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at',

      defaultScope: {
        attributes: { exclude: ['password'] }
      },

      scopes: {
        withPassword: {
          attributes: { include: ['password'] }
        }
      }
    }
  );

  // ---------- HOOKS ----------
  User.addHook('beforeCreate', async (user) => {
    if (user.password && !user.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  User.addHook('beforeUpdate', async (user) => {
    if (user.changed('password') && user.password && !user.password.startsWith('$2')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  // ---------- INSTANCE METHODS ----------
  User.prototype.matchPassword = async function (enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
  };

  User.prototype.getSignedJwtToken = function () {
    return jwt.sign(
      { id: this.id, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  };

  User.prototype.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };

  // ---------- ASSOCIATIONS ----------
  User.associate = (models) => {
    User.hasOne(models.Caregiver, {
      foreignKey: 'userId',
      as: 'caregiverProfile'
    });
  };

  return User;
};
