// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// // Create a new Sequelize instance
// const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//         host: process.env.DB_HOST,
//         dialect: 'mysql',
//         logging: process.env.NODE_ENV === 'development' ? console.log : false,
//         pool: {
//             max: 5,
//             min: 0,
//             acquire: 30000,
//             idle: 10000
//         }
//     }
// );

// // Test the database connection
// async function testConnection() {
//     try {
//         await sequelize.authenticate();
//         console.log('Database connection has been established successfully.');
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// }

// testConnection();

// module.exports = sequelize;
// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        define: {
            timestamps: true,
            underscored: true,
            timestampsWithDefaults: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            freezeTableName: true,
            paranoid: true,
            dialectOptions: {
                dateStrings: true,
                typeCast: function (field, next) {
                    if (field.type === 'DATETIME') {
                        return field.string();
                    }
                    return next();
                }
            }
        }
    }
);

module.exports = {
    sequelize,
    Sequelize
};