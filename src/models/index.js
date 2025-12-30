'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');

// Use DB connection from database.js
const { sequelize } = require('../config/database');

const db = {};
const basename = path.basename(__filename);

// Test DB connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected'))
  .catch(err => console.error('❌ Database connection failed:', err));

const models = [
  'User.model',
  'Contact.model',
  'Booking.model',
  'Caregiver.model',
  'Invoice.model'
];

// Load models
models.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, DataTypes);
  db[model.name] = model;
});

// Apply associations if any
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
