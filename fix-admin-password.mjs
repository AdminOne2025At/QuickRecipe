import { config } from 'dotenv';
import { scrypt, randomBytes, timingSafeEqual } from 'crypto';
import { promisify } from 'util';
import pg from 'pg';

config(); // تحميل ملف .env
const scryptAsync = promisify(scrypt);
const { Client } = pg;

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);
  const hashedPassword = `${derivedKey.toString('hex')}.${salt}`;
  console.log('Hashed password successfully generated');
  return hashedPassword;
}

async function updateAdminPassword() {
  try {
    const hashedPassword = await hashPassword('admin123');
    console.log('Generated hashed password');
    
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
    });
    
    await client.connect();
    console.log('Connected to database');
    
    const result = await client.query(
      'UPDATE users SET password = $1 WHERE username = $2 RETURNING id',
      [hashedPassword, 'admin']
    );
    
    if (result.rows && result.rows.length > 0) {
      console.log(`Updated password for admin (ID: ${result.rows[0].id})`);
    } else {
      console.log('Admin user not found');
    }
    
    await client.end();
    console.log('Closed database connection');
  } catch (err) {
    console.error('Error updating admin password:', err);
    process.exit(1);
  }
}

updateAdminPassword();