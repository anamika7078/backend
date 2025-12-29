const db = require('./src/models');
const User = db.User;

async function testDbConnection() {
    try {
        // Test the database connection
        await db.sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Test User model
        console.log('Testing User model...');
        console.log('User model methods:', Object.keys(User));

        // Try to find a user
        const users = await User.findAll();
        console.log('Found users:', users);

        console.log('Database test completed successfully!');
    } catch (error) {
        console.error('Error during database test:', error);
    } finally {
        // Close the database connection
        await db.sequelize.close();
    }
}

testDbConnection();
