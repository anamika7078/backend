'use strict';

const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Initialize Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: config.dialect,
      logging: console.log, // Enable SQL logging
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

// Test the connection
sequelize.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.error('Unable to connect to the database:', err));

// Import models
const User = require('./User.model')(sequelize, DataTypes);
const Contact = require('./Contact.model')(sequelize, DataTypes);
const Booking = require('./Booking.model')(sequelize, DataTypes);
const Caregiver = require('./Caregiver.model')(sequelize, DataTypes);
const Invoice = require('./Invoice.model')(sequelize, DataTypes);

db[User.name] = User;
db[Contact.name] = Contact;
db[Booking.name] = Booking;
db[Caregiver.name] = Caregiver;
db[Invoice.name] = Invoice;

// Associate models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;