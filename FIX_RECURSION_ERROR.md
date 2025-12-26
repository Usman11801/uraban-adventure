# Fix RLS Recursion Error

## Problem

If you see this error:
```
infinite recursion detected in policy for relation "user_profiles"
```

This means the RLS policies are causing a circular dependency.

## Solution

### Option 1: If You Haven't Run Migration Yet

Just run the updated `001_initial_schema.sql` - it's already fixed!

### Option 2: If You Already Ran Migration (Tables Exist)

Run this fix script in Supabase SQL Editor:

1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/sql/new
2. Open file: `supabase/migrations/002_fix_rls_recursion.sql`
3. Copy ALL the SQL
4. Paste and click **Run**

This will:
- ✅ Drop the problematic policies
- ✅ Create the `is_admin()` helper function
- ✅ Update all policies to use the helper function

### Option 3: Manual Fix

If you prefer to fix manually:

1. **Drop the problematic policies:**
```sql
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON user_profiles;
```

2. **Create the helper function:**
```sql
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM user_profiles
    WHERE id = user_id;
    
    RETURN COALESCE(user_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;
```

3. **Recreate admin policies** (they're already updated in the main migration file)

## Verify Fix

After running the fix, test the connection:

```bash
node scripts/setup-database.js
```

Should show: ✅ Connected to Supabase

## Why This Happens

The original policies checked `user_profiles` table to see if a user is admin, but checking `user_profiles` triggers the same policy check again, creating infinite recursion.

The `is_admin()` function uses `SECURITY DEFINER` which bypasses RLS, breaking the recursion.

