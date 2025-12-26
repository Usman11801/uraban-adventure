# Fix Migration RLS Error

## Problem

Migration script fails with:
```
new row violates row-level security policy for table "categories"
```

## Root Cause

Your `.env.local` has the **anon key** in `SUPABASE_SERVICE_ROLE_KEY` instead of the actual **service_role key**.

The migration script needs the service_role key to bypass RLS policies.

## Solution

### Step 1: Get the Correct Service Role Key

1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/settings/api
2. Scroll to **Project API keys**
3. Find the **service_role** key (it's marked as "secret")
4. **Copy it** (it's different from the anon key!)

### Step 2: Update .env.local

Open `.env.local` and update:

```env
# ❌ WRONG (current - this is the anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ...cm9sZSI6ImFub24i...

# ✅ CORRECT (should have "service_role" in the JWT)
SUPABASE_SERVICE_ROLE_KEY=eyJ...cm9sZSI6InNlcnZpY2Vfcm9sZSIi...
```

**How to verify:**
- Decode the JWT at https://jwt.io
- Look for `"role"` field
- Should be `"service_role"` NOT `"anon"`

### Step 3: Run Service Role Policies (Optional but Recommended)

If you want to be extra safe, run this SQL in Supabase:

1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/sql/new
2. Open: `supabase/migrations/003_allow_service_role_inserts.sql`
3. Copy and run the SQL

This explicitly allows service_role to insert data (though it should work automatically).

### Step 4: Run Migration Again

```bash
npm run migrate
```

Should now work! ✅

## Why This Happens

- **Anon key**: Subject to RLS policies (can only read public data)
- **Service role key**: Bypasses RLS completely (can do anything)

The migration script needs to insert data, so it requires service_role key.

## Quick Check

After updating `.env.local`, verify:

```bash
node scripts/setup-database.js
```

Should show: ✅ Connected (without the warning about anon key)

