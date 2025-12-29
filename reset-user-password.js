/**
 * Script to reset a specific user's password
 * Usage: node reset-user-password.js <email> <newPassword>
 * Example: node reset-user-password.js mainAdmin@gmail.com newpassword123
 */

require('dotenv').config();
const db = require('./src/models');
const bcrypt = require('bcryptjs');

async function resetUserPassword() {
    const email = process.argv[2];
    const newPassword = process.argv[3];

    if (!email || !newPassword) {
        console.error('Usage: node reset-user-password.js <email> <newPassword>');
        console.error('Example: node reset-user-password.js mainAdmin@gmail.com newpassword123');
        process.exit(1);
    }

    if (newPassword.length < 6) {
        console.error('Error: Password must be at least 6 characters long');
        process.exit(1);
    }

    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Database connected successfully');

        // Find user
        const user = await db.User.scope('withPassword').findOne({
            where: { email }
        });

        if (!user) {
            console.error(`Error: User with email ${email} not found`);
            process.exit(1);
        }

        console.log(`Found user: ${user.name} (${user.email})`);
        console.log('Resetting password...');

        // Update password - the beforeSave hook will hash it
        user.password = newPassword;
        await user.save();

        console.log('Password reset successfully!');
        console.log(`User can now login with email: ${email} and the new password.`);

        process.exit(0);
    } catch (error) {
        console.error('Error resetting password:', error);
        process.exit(1);
    }
}

resetUserPassword();

