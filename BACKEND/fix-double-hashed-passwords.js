/**
 * Script to fix users with double-hashed passwords
 * Run this with: node fix-double-hashed-passwords.js
 */

require('dotenv').config();
const db = require('./src/models');
const bcrypt = require('bcryptjs');

async function fixDoubleHashedPasswords() {
    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Database connected successfully');

        // Get all users with passwords
        const users = await db.User.scope('withPassword').findAll();

        console.log(`Found ${users.length} users to check...`);

        let fixedCount = 0;
        let skippedCount = 0;

        for (const user of users) {
            if (!user.password) {
                console.log(`Skipping user ${user.email} - no password set`);
                skippedCount++;
                continue;
            }

            // Check if password looks like it might be double-hashed
            // Double-hashed passwords are typically longer and have a different structure
            // A normal bcrypt hash is 60 characters, but double-hashed would be hashing a hash
            // However, the real test is: can we verify it with a test password?
            
            // For now, we'll just log and let you manually fix or reset passwords
            // The best approach is to reset passwords for affected users
            console.log(`User: ${user.email}, Password hash length: ${user.password.length}`);
            
            // If you know the original password, you can test it here
            // For security, we won't try to "unhash" - users should reset their passwords
        }

        console.log(`\nSummary:`);
        console.log(`- Checked: ${users.length} users`);
        console.log(`- Fixed: ${fixedCount} users`);
        console.log(`- Skipped: ${skippedCount} users`);
        console.log('\nNote: If passwords are double-hashed, users need to reset them.');
        console.log('You can use the forgot password feature or manually update passwords.');

        process.exit(0);
    } catch (error) {
        console.error('Error fixing passwords:', error);
        process.exit(1);
    }
}

fixDoubleHashedPasswords();

