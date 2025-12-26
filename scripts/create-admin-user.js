/**
 * Script to create an admin user
 * 
 * Usage:
 * node scripts/create-admin-user.js <email> <password>
 * 
 * Example:
 * node scripts/create-admin-user.js admin@example.com mypassword123
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser(email, password) {
  console.log(`\n🔐 Creating admin user...`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}\n`);

  // Step 1: Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email
  });

  if (authError) {
    if (authError.message.includes('already registered')) {
      console.log('⚠️  User already exists in auth. Checking profile...');
      
      // Get existing user
      const { data: existingUsers } = await supabase.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === email);
      
      if (!existingUser) {
        console.error('❌ Could not find existing user');
        process.exit(1);
      }

      // Check if profile exists
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', existingUser.id)
        .single();

      if (profile) {
        if (profile.role === 'admin') {
          console.log('✅ User already exists and is already an admin!');
          console.log(`\n📋 Admin Login Details:`);
          console.log(`   URL: http://localhost:3000/admin/login`);
          console.log(`   Email: ${email}`);
          console.log(`   Password: ${password}`);
          return;
        } else {
          // Update to admin
          const { error: updateError } = await supabase
            .from('user_profiles')
            .update({ role: 'admin' })
            .eq('id', existingUser.id);

          if (updateError) {
            console.error('❌ Error updating user role:', updateError);
            process.exit(1);
          }

          console.log('✅ Updated existing user to admin role!');
          console.log(`\n📋 Admin Login Details:`);
          console.log(`   URL: http://localhost:3000/admin/login`);
          console.log(`   Email: ${email}`);
          console.log(`   Password: ${password}`);
          return;
        }
      } else {
        // Create profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: existingUser.id,
            email: existingUser.email,
            role: 'admin'
          });

        if (profileError) {
          console.error('❌ Error creating user profile:', profileError);
          process.exit(1);
        }

        console.log('✅ Created admin profile for existing user!');
        console.log(`\n📋 Admin Login Details:`);
        console.log(`   URL: http://localhost:3000/admin/login`);
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        return;
      }
    } else {
      console.error('❌ Error creating user:', authError.message);
      process.exit(1);
    }
  }

  if (!authData?.user) {
    console.error('❌ Failed to create user');
    process.exit(1);
  }

  const userId = authData.user.id;

  // Step 2: Create user profile with admin role
  const { error: profileError } = await supabase
    .from('user_profiles')
    .insert({
      id: userId,
      email: authData.user.email,
      role: 'admin'
    });

  if (profileError) {
    console.error('❌ Error creating user profile:', profileError);
    // Try to delete the auth user if profile creation fails
    await supabase.auth.admin.deleteUser(userId);
    process.exit(1);
  }

  console.log('✅ Admin user created successfully!');
  console.log(`\n📋 Admin Login Details:`);
  console.log(`   URL: http://localhost:3000/admin/login`);
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`\n🚀 You can now login at: http://localhost:3000/admin/login\n`);
}

// Get command line arguments
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.error('❌ Usage: node scripts/create-admin-user.js <email> <password>');
  console.error('\nExample:');
  console.error('   node scripts/create-admin-user.js admin@example.com mypassword123');
  process.exit(1);
}

createAdminUser(email, password).catch(console.error);

