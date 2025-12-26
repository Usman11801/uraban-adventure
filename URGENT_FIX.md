# ⚠️ URGENT: Fix Migration - No Packages in Database

## The Problem

Your migration is failing because `.env.local` has the **anon key** where the **service_role key** should be.

## Quick Fix (2 minutes)

### Step 1: Get Service Role Key

1. Open: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/settings/api
2. Scroll to **"Project API keys"** section
3. Find **"service_role"** key (it says "secret" next to it)
4. Click **"Reveal"** or **"Copy"** to get the full key
5. **Copy the entire key** (it's very long, starts with `eyJ...`)

### Step 2: Update .env.local

Open `.env.local` and find this line:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91a2VvemZtZnV5Z3FmZ21ocG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjczNzMsImV4cCI6MjA4MjAwMzM3M30.EP2d_okDbre-5AFdLBAaSWUKGeHWg0I2FaHzdqyGdBI
```

**Replace it with:**

```env
SUPABASE_SERVICE_ROLE_KEY=<paste-the-service-role-key-here>
```

**Important:** The service_role key is DIFFERENT from the anon key. It should be much longer and have `"role":"service_role"` in it (not `"role":"anon"`).

### Step 3: Verify the Key

You can verify at https://jwt.io:
- Paste the key
- Look at the "Payload" section
- Find `"role"` field
- Should say `"service_role"` NOT `"anon"`

### Step 4: Run Migration Again

```bash
npm run migrate
```

Should now work! ✅

## Why This Matters

- **Anon key**: Can only read public data (blocked by RLS)
- **Service role key**: Bypasses all RLS (can insert/update/delete)

The migration needs to INSERT data, so it requires service_role key.

## Expected Output After Fix

```
Starting migration...

Migrating sight-see-list...
✅ Created category: Sight See List
✅ Created package: Abu Dhabi City Tour
  Migrated 3 reviews
✅ Created package: Private Half Day Dubai City Tour
  Migrated 3 reviews
...
  Migrated 25/25 tours from sight-see-list

Migration completed!
```

## Still Having Issues?

1. Make sure you copied the ENTIRE service_role key (it's very long)
2. Make sure there are no extra spaces or quotes in `.env.local`
3. Restart your terminal after updating `.env.local`
4. Run `node scripts/setup-database.js` to verify connection

