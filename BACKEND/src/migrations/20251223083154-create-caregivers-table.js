'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
   up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('caregivers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      specialization: {
        type: Sequelize.STRING,
        allowNull: true
      },
      experience: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      availability: {
        type: Sequelize.ENUM('Full-time', 'Part-time', 'On-call', 'Weekends only'),
        defaultValue: 'Full-time'
      },
      status: {
        type: Sequelize.ENUM('Active', 'On Leave', 'Inactive'),
        defaultValue: 'Active'
      },
      skills: {
        type: Sequelize.JSON,
        allowNull: true
      },
      dateOfBirth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergencyContact: {
        type: Sequelize.STRING,
        allowNull: true
      },
      emergencyPhone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      profileImage: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0
      },
      totalRatings: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      hourlyRate: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      languages: {
        type: Sequelize.JSON,
        allowNull: true
      },
      certifications: {
        type: Sequelize.JSON,
        allowNull: true
      },
      joinDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      lastActive: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
    // Add indexes
    await queryInterface.addIndex('caregivers', ['userId'], { unique: true });
    await queryInterface.addIndex('caregivers', ['specialization']);
    await queryInterface.addIndex('caregivers', ['status']);
    await queryInterface.addIndex('caregivers', ['city', 'state']);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('caregivers');
  }
};
