/**
 * Database Setup Script
 * 
 * This script helps you:
 * 1. Verify Supabase connection
 * 2. Check if tables exist
 * 3. Run the migration SQL
 * 
 * Usage: node scripts/setup-database.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease check your .env.local file and ensure both values are set.');
  process.exit(1);
}

// Check if service role key is correct (should contain "service_role" in JWT)
const keyParts = supabaseKey.split('.');
if (keyParts.length === 3) {
  try {
    const payload = JSON.parse(Buffer.from(keyParts[1], 'base64').toString());
    if (payload.role !== 'service_role') {
      console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY appears to be an anon key, not service_role key!');
      console.warn('   Please get the service_role key from Supabase Dashboard → Settings → API');
      console.warn('   It should have "service_role" in the role field, not "anon"');
    }
  } catch (e) {
    // Not a valid JWT, might be a different format
  }
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function checkConnection() {
  console.log('🔌 Testing Supabase connection...');
  try {
    const { data, error } = await supabase.from('categories').select('count').limit(1);
    if (error && error.code === '42P01') {
      // Table doesn't exist - that's expected if migration hasn't run
      console.log('✅ Connected to Supabase (tables not created yet)');
      return true;
    } else if (error) {
      console.error('❌ Connection error:', error.message);
      return false;
    } else {
      console.log('✅ Connected to Supabase');
      return true;
    }
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

async function checkTables() {
  console.log('\n📋 Checking database tables...');
  const tables = ['categories', 'packages', 'package_addons', 'reviews', 'guides', 'bookings', 'user_profiles'];
  const existingTables = [];
  const missingTables = [];

  for (const table of tables) {
    try {
      const { error } = await supabase.from(table).select('*').limit(1);
      if (error && error.code === '42P01') {
        missingTables.push(table);
      } else {
        existingTables.push(table);
      }
    } catch (e) {
      missingTables.push(table);
    }
  }

  if (existingTables.length > 0) {
    console.log('✅ Existing tables:', existingTables.join(', '));
  }
  if (missingTables.length > 0) {
    console.log('❌ Missing tables:', missingTables.join(', '));
  }

  return { existingTables, missingTables };
}

async function runMigration() {
  console.log('\n📝 Reading migration SQL file...');
  const sqlPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  
  if (!fs.existsSync(sqlPath)) {
    console.error('❌ Migration file not found:', sqlPath);
    return false;
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('✅ Migration file loaded');
  console.log('\n⚠️  IMPORTANT: You need to run this SQL in Supabase Dashboard!');
  console.log('\nSteps:');
  console.log('1. Go to: https://app.supabase.com/project/_/sql');
  console.log('2. Click "New Query"');
  console.log('3. Copy the SQL from: supabase/migrations/001_initial_schema.sql');
  console.log('4. Paste and click "Run"');
  console.log('\nOr use Supabase CLI if you have it installed.');
  
  return false; // We can't run SQL directly via JS client for DDL
}

async function main() {
  console.log('🚀 Database Setup Script\n');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Service Role Key:', supabaseKey.substring(0, 20) + '...');
  console.log('');

  // Test connection
  const connected = await checkConnection();
  if (!connected) {
    console.error('\n❌ Cannot proceed without database connection.');
    console.error('Please check your .env.local credentials.');
    rl.close();
    process.exit(1);
  }

  // Check tables
  const { existingTables, missingTables } = await checkTables();

  if (missingTables.length === 0) {
    console.log('\n✅ All tables exist! Database is ready.');
    rl.close();
    return;
  }

  if (missingTables.length > 0) {
    console.log('\n⚠️  Some tables are missing. You need to run the migration.');
    const answer = await question('\nDo you want instructions to run the migration? (y/n): ');
    
    if (answer.toLowerCase() === 'y') {
      await runMigration();
    }
  }

  rl.close();
}

main().catch(console.error);

