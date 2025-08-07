const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB
});

async function checkUsers() {
  try {
    console.log('🔍 Checking users in database...');
    
    const result = await pool.query('SELECT id, email, role, created_at FROM users ORDER BY created_at');
    
    console.log(`✅ Found ${result.rows.length} users:`);
    result.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role}) - Created: ${user.created_at}`);
    });
    
    // Test login with admin
    console.log('\n🔐 Testing admin login...');
    const adminResult = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      ['admin@example.com']
    );
    
    if (adminResult.rows.length > 0) {
      const admin = adminResult.rows[0];
      console.log(`✅ Admin found: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Password hash: ${admin.password_hash.substring(0, 20)}...`);
    } else {
      console.log('❌ Admin user not found!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsers();
