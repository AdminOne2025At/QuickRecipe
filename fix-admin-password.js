require('dotenv').config();
const { scrypt, randomBytes } = require('crypto');
const util = require('util');
const scryptAsync = util.promisify(scrypt);
const { Client } = require('pg');

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  const hashedPassword = `${derivedKey.toString('hex')}.${salt}`;
  console.log('Hashed password generated');
  return hashedPassword;
}

async function updateAdminPassword() {
  try {
    const hashedPassword = await hashPassword('admin123');
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
    console.log('Connected to database');
    
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING id',
      [hashedPassword, 'admin']
    );
    
    console.log(`Updated password for admin (ID: ${result.rows[0]?.id || 'unknown'})`);
    await client.end();
  } catch (err) {
    console.error('Error updating admin password:', err);
    process.exit(1);
  }
}

updateAdminPassword();