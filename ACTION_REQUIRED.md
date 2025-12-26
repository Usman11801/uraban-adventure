# ⚠️ ACTION REQUIRED: Fix These Issues

## Issue 1: Wrong Service Role Key ❌

**Problem:** Your `.env.local` has the **anon key** where the **service_role key** should be.

**Fix:**
1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/settings/api
2. Scroll to **Project API keys** section
3. Find **service_role** key (it's the secret one, different from anon)
4. Copy it
5. Update `.env.local`:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=PASTE_THE_SERVICE_ROLE_KEY_HERE
   ```

**How to identify:**
- Anon key has: `"role":"anon"` in the JWT
- Service role key has: `"role":"service_role"` in the JWT

---

## Issue 2: Database Tables Not Created ❌

**Problem:** The database tables don't exist yet.

**Fix:**
1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/sql/new
2. Click **New Query**
3. Open file: `supabase/migrations/001_initial_schema.sql`
4. Copy **ALL** the SQL code (360+ lines)
5. Paste into SQL Editor
6. Click **Run** button
7. Wait for "Success" message

**Tables that will be created:**
- categories
- packages
- package_addons
- reviews
- guides
- bookings
- user_profiles

---

## After Fixing Both Issues

### Step 1: Verify Setup
```bash
node scripts/setup-database.js
```
Should show: ✅ Connected and ✅ All tables exist

### Step 2: Migrate Your Data
```bash
npm run migrate
```
This will migrate all tours from JSON files to database.

### Step 3: Create Admin User
1. Create user in Supabase → Authentication → Users
2. Copy the User UUID
3. Run this SQL:
```sql
INSERT INTO user_profiles (id, email, role)
VALUES ('USER_UUID_HERE', 'your-email@example.com', 'admin');
```

### Step 4: Test Admin Panel
```bash
npm run dev
```
Go to: http://localhost:3000/admin/login

---

## Quick Reference

**Your Supabase Project:**
- URL: https://oukeozfmfuygqfgmhpos.supabase.co
- Dashboard: https://app.supabase.com/project/oukeozfmfuygqfgmhpos

**Files to check:**
- `.env.local` - Fix service_role key
- `supabase/migrations/001_initial_schema.sql` - Run this SQL

**Commands:**
- `node scripts/setup-database.js` - Test connection
- `npm run migrate` - Migrate data
- `npm run dev` - Start app

---

## Detailed Guides

- `DATABASE_SETUP.md` - Complete setup instructions
- `QUICK_START.md` - Quick reference
- `ENV_SETUP_GUIDE.md` - Environment variables help

