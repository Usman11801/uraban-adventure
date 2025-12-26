# Environment Variables Setup Guide

## ⚠️ Important: Fix Your .env.local

I noticed your `.env.local` file has the **anon key** in the `SUPABASE_SERVICE_ROLE_KEY` field. This needs to be fixed!

### Current Issue

Your current `.env.local` shows:
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...cm9sZSI6ImFub24i...  ❌ (This is the anon key!)
```

### How to Fix

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Find the **service_role** key (NOT the anon/public key)
5. Copy it
6. Update `.env.local`:

```env
# ✅ CORRECT - Service Role Key (starts with eyJ... and has "service_role" in it)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91a2VvemZtZnV5Z3FmZ21ocG9zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIiLCJpYXQiOjE3NjY0MjczNzMsImV4cCI6MjA4MjAwMzM3M30.XXXXX

# ❌ WRONG - Anon Key (has "anon" in it)
# SUPABASE_SERVICE_ROLE_KEY=eyJ...cm9sZSI6ImFub24i...
```

### How to Identify the Correct Key

- **Anon Key**: Has `"role":"anon"` in the JWT payload
- **Service Role Key**: Has `"role":"service_role"` in the JWT payload

You can decode the JWT at https://jwt.io to check.

### Complete .env.local Template

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://oukeozfmfuygqfgmhpos.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91a2VvemZtZnV5Z3FmZ21ocG9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0MjczNzMsImV4cCI6MjA4MjAwMzM3M30.EP2d_okDbre-5AFdLBAaSWUKGeHWg0I2FaHzdqyGdBI

# ⚠️ IMPORTANT: Get the SERVICE_ROLE key from Supabase Dashboard → Settings → API
# It should have "service_role" in the role, NOT "anon"
SUPABASE_SERVICE_ROLE_KEY=PASTE_SERVICE_ROLE_KEY_HERE

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Ziina Payment (existing)
ZIINA_API_KEY=zAEJFJIy8qvmGLn+AKqdY0ZqNb0H9UWm7jJJWyr9A1CrNytIYaL4aTt4jtC/geLS
ZIINA_API_BASE=https://api-v2.ziina.com
ZIINA_PAYMENT_INTENT_PATH=/api/payment_intent
ZIINA_MOCK=false
```

## Next Steps After Fixing .env.local

1. **Create Database Tables:**
   - Go to Supabase Dashboard → SQL Editor
   - Run the SQL from `supabase/migrations/001_initial_schema.sql`

2. **Test Connection:**
   ```bash
   node scripts/setup-database.js
   ```

3. **Migrate Data:**
   ```bash
   npm run migrate
   ```

4. **Create Admin User:**
   - Follow instructions in `QUICK_START.md`

