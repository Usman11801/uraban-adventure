# Complete Setup Instructions

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details:
   - Name: `dubai-tourism` (or your preferred name)
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Wait for project to be created (2-3 minutes)

## Step 2: Get Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Step 3: Configure Environment Variables

1. Open `.env.local` file in the root directory
2. Replace the placeholder values with your actual Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open the file: `supabase/migrations/001_initial_schema.sql`
4. Copy the entire contents
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for "Success. No rows returned" message

✅ Database tables are now created!

## Step 5: Create Admin User

### Option A: Using Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `admin@example.com` (use your email)
   - Password: (choose a strong password)
4. Click **Create user**
5. Copy the **User UID** (it's a UUID)

### Option B: Using SQL

1. Go to **SQL Editor**
2. Run this SQL (replace with your email and a hashed password):

```sql
-- First, create the user in auth.users (you'll need to use Supabase Auth API or dashboard)
-- Then run this to set admin role:

INSERT INTO user_profiles (id, email, role)
VALUES (
  'YOUR_USER_UUID_HERE',  -- Replace with the UUID from Authentication > Users
  'admin@example.com',    -- Replace with your email
  'admin'
);
```

**Note:** The easiest way is to create the user in the dashboard first, then run the SQL above with the UUID.

## Step 6: Install Dependencies

```bash
npm install
```

This installs:
- `@supabase/supabase-js`
- `@supabase/ssr`
- `dotenv` (for migration script)

## Step 7: Migrate Existing JSON Data

Run the migration script to move all your existing tour data from JSON files to Supabase:

```bash
node scripts/migrate-tours-to-supabase.js
```

This will:
- ✅ Create categories from page names
- ✅ Migrate all tours from all `toursData.json` files
- ✅ Preserve reviews, images, and all data
- ✅ Show progress for each page

**Expected output:**
```
Starting migration...

Migrating sight-see-list...
Created category: Sight See List
Created package: Abu Dhabi City Tour
  Migrated 3 reviews
Created package: Private Half Day Dubai City Tour
  Migrated 3 reviews
...
  Migrated 25/25 tours from sight-see-list

Migration completed!
```

## Step 8: Verify Migration

1. Go to Supabase dashboard → **Table Editor**
2. Check these tables have data:
   - `categories` - Should have categories
   - `packages` - Should have all your tours
   - `reviews` - Should have reviews

## Step 9: Start Development Server

```bash
npm run dev
```

## Step 10: Access Admin Panel

1. Open: http://localhost:3000/admin/login
2. Login with the admin credentials you created
3. You should see the dashboard!

## Troubleshooting

### Migration script errors

If you get "Missing Supabase credentials":
- Make sure `.env.local` exists and has correct values
- Restart terminal after creating `.env.local`

### "Table does not exist" error

- Make sure you ran the SQL migration in Step 4
- Check that all tables were created in Table Editor

### "Unauthorized" when accessing admin

- Make sure you created the admin user profile in `user_profiles` table
- Check that the role is set to `'admin'` (not `'user'`)

### Can't login to admin panel

- Verify user exists in Authentication > Users
- Verify user_profiles entry exists with `role = 'admin'`
- Try creating a new user and profile entry

## Next Steps

- ✅ Admin panel is ready to use
- ✅ All existing data is migrated
- ✅ You can now manage everything from the admin panel
- 🔄 Update other tour list pages to use API (similar to `sight-see-list`)

## Need Help?

Check the main README: `README_ADMIN_SETUP.md`

