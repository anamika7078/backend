require('dotenv').config();
const app = require('./src/app');
const db = require('./src/models');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Test the database connection
        await db.sequelize.authenticate();
        console.log('Database connected successfully');

        // Sync all models
        await db.sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('Database synced');

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();