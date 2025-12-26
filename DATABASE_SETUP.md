# Database Setup & Data Migration Guide

## ⚠️ CRITICAL: Fix Your .env.local First!

Your `.env.local` currently has the **anon key** where the **service_role key** should be.

### Step 1: Get the Correct Service Role Key

1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/settings/api
2. Scroll down to **Project API keys**
3. Find the **service_role** key (⚠️ Keep this secret!)
4. Copy it

### Step 2: Update .env.local

Open `.env.local` and update this line:

```env
# Replace this line with the service_role key from Supabase
SUPABASE_SERVICE_ROLE_KEY=PASTE_SERVICE_ROLE_KEY_HERE
```

**Important:** The service_role key is different from the anon key. It should have `"role":"service_role"` in the JWT, not `"role":"anon"`.

---

## Step 3: Create Database Tables

### Option A: Using Supabase Dashboard (Recommended)

1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/sql/new
2. Click **New Query**
3. Open the file: `supabase/migrations/001_initial_schema.sql`
4. **Copy the ENTIRE contents** (all 360+ lines)
5. Paste into the SQL Editor
6. Click **Run** (or press Cmd/Ctrl + Enter)
7. Wait for "Success. No rows returned" message
8. ✅ Tables are created!

### Option B: Verify Tables Were Created

1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/editor
2. You should see these tables:
   - ✅ categories
   - ✅ packages
   - ✅ package_addons
   - ✅ reviews
   - ✅ guides
   - ✅ bookings
   - ✅ user_profiles

---

## Step 4: Test Connection

Run this to verify everything is set up correctly:

```bash
node scripts/setup-database.js
```

This will:
- ✅ Test Supabase connection
- ✅ Check which tables exist
- ✅ Warn you if service_role key is wrong

---

## Step 5: Migrate Your Data

Once tables are created, migrate all your JSON tour data:

```bash
npm run migrate
```

**What this does:**
- Reads all `toursData.json` files from your pages
- Creates categories automatically
- Migrates all tours with their data
- Preserves reviews, images, inclusions, etc.
- Shows progress for each page

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

Migrating tour-list...
...
Migration completed!
```

---

## Step 6: Verify Migration

1. Go to Supabase Dashboard → **Table Editor**
2. Check:
   - **categories** table - Should have categories
   - **packages** table - Should have all your tours
   - **reviews** table - Should have reviews

---

## Step 7: Create Admin User

### Method 1: Using Dashboard + SQL

1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/auth/users
2. Click **Add user** → **Create new user**
3. Enter:
   - Email: `admin@example.com` (use your email)
   - Password: (choose a strong password)
4. Click **Create user**
5. **Copy the User UID** (it's a UUID like `123e4567-e89b-12d3-a456-426614174000`)

6. Go to **SQL Editor** and run:

```sql
INSERT INTO user_profiles (id, email, role)
VALUES (
  'PASTE_USER_UUID_HERE',  -- Replace with UUID from step 5
  'admin@example.com',     -- Replace with your email
  'admin'
);
```

7. Click **Run**

### Method 2: Using Supabase Auth API (Alternative)

You can also create the user programmatically, but the dashboard method is easier.

---

## Step 8: Test Admin Login

1. Start the dev server:
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:3000/admin/login

3. Login with:
   - Email: The email you used in Step 7
   - Password: The password you set

4. ✅ You should see the admin dashboard!

---

## Troubleshooting

### "Missing Supabase credentials" error

- Check `.env.local` exists in the root directory
- Verify all 3 Supabase variables are set
- Restart terminal after creating/updating `.env.local`

### "Table does not exist" error

- Make sure you ran the SQL migration in Step 3
- Check Supabase → Table Editor to verify tables exist
- Re-run the migration SQL if needed

### "Unauthorized" when accessing admin

- Verify `user_profiles` table has your user
- Check that `role = 'admin'` (not `'user'`)
- Make sure the UUID in `user_profiles` matches the one in `auth.users`

### Migration script fails

- Ensure database tables are created first (Step 3)
- Check that JSON files exist in `app/*/toursData.json`
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct (not anon key)

### Service Role Key Issues

If you see warnings about the service_role key:
1. Go to Supabase Dashboard → Settings → API
2. Find the **service_role** key (it's separate from anon key)
3. Copy it to `.env.local`
4. The key should be LONG and different from the anon key

---

## Quick Checklist

- [ ] Fixed `.env.local` with correct service_role key
- [ ] Created database tables (ran SQL migration)
- [ ] Tested connection (`node scripts/setup-database.js`)
- [ ] Migrated data (`npm run migrate`)
- [ ] Created admin user in `user_profiles` table
- [ ] Can login to admin panel

---

## Need Help?

- Check `QUICK_START.md` for a condensed guide
- Check `SETUP_INSTRUCTIONS.md` for detailed instructions
- Check `ENV_SETUP_GUIDE.md` for environment variable help

