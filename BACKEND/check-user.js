/**
 * Script to check user details and verify password
 * Usage: node check-user.js <email>
 * Example: node check-user.js mainAdmin@gmail.com
 */

require('dotenv').config();
const db = require('./src/models');
const bcrypt = require('bcryptjs');

async function checkUser() {
    const email = process.argv[2];

    if (!email) {
        console.error('Usage: node check-user.js <email>');
        console.error('Example: node check-user.js mainAdmin@gmail.com');
        process.exit(1);
    }

    try {
        console.log('Connecting to database...');
        await db.sequelize.authenticate();
        console.log('Database connected successfully\n');

        // Find user
        const user = await db.User.scope('withPassword').findOne({
            where: { email }
        });

        if (!user) {
            console.error(`❌ User with email ${email} not found`);
            process.exit(1);
        }

        console.log('✅ User found:');
        console.log(`   ID: ${user.id}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Password hash exists: ${!!user.password}`);
        console.log(`   Password hash length: ${user.password ? user.password.length : 0}`);
        console.log(`   Password hash preview: ${user.password ? user.password.substring(0, 30) + '...' : 'N/A'}`);
        
        // Check if password looks like bcrypt hash
        if (user.password) {
            const isBcryptHash = user.password.startsWith('$2');
            console.log(`   Is valid bcrypt hash: ${isBcryptHash}`);
            
            if (!isBcryptHash) {
                console.log('   ⚠️  WARNING: Password does not appear to be a valid bcrypt hash!');
            }
        }

        console.log('\n💡 To reset this user\'s password, run:');
        console.log(`   node reset-user-password.js ${email} <newPassword>`);

        process.exit(0);
    } catch (error) {
        console.error('Error checking user:', error);
        process.exit(1);
    }
}

checkUser();

