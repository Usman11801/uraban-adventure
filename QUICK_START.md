# Quick Start Guide

## 🚀 Setup Supabase & Migrate Data

### Step 1: Get Supabase Credentials

1. Go to https://app.supabase.com and create a new project (or use existing)
2. Go to **Settings** → **API**
3. Copy these 3 values:
   - **Project URL** 
   - **anon public** key
   - **service_role** key (⚠️ Keep secret!)

### Step 2: Add Credentials to .env.local

Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Create Database Tables

1. In Supabase dashboard → **SQL Editor**
2. Click **New Query**
3. Open file: `supabase/migrations/001_initial_schema.sql`
4. Copy ALL the SQL code
5. Paste into SQL Editor
6. Click **Run** (or Cmd/Ctrl + Enter)
7. ✅ Wait for "Success" message

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Migrate Your Data

```bash
npm run migrate
```

This will:
- ✅ Create categories from page names
- ✅ Migrate all tours from JSON files
- ✅ Preserve reviews, images, and all data
- ✅ Show progress for each page

**Expected output:**
```
Starting migration...

Migrating sight-see-list...
Created category: Sight See List
Created package: Abu Dhabi City Tour
  Migrated 3 reviews
...
  Migrated 25/25 tours from sight-see-list

Migration completed!
```

### Step 6: Create Admin User

1. Go to Supabase → **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Enter email and password
4. Copy the **User UID** (UUID)
5. Go to **SQL Editor** and run:

```sql
INSERT INTO user_profiles (id, email, role)
VALUES ('PASTE_USER_UUID_HERE', 'your-email@example.com', 'admin');
```

Replace `PASTE_USER_UUID_HERE` with the UUID from step 4.

### Step 7: Start the App

```bash
npm run dev
```

### Step 8: Login to Admin Panel

1. Go to: http://localhost:3000/admin/login
2. Login with your admin credentials
3. 🎉 You're ready to manage your tours!

---

## 📋 Checklist

- [ ] Supabase project created
- [ ] Credentials added to `.env.local`
- [ ] Database tables created (SQL migration run)
- [ ] Dependencies installed (`npm install`)
- [ ] Data migrated (`npm run migrate`)
- [ ] Admin user created
- [ ] Can login to admin panel

---

## 🆘 Troubleshooting

**"Missing Supabase credentials" error:**
- Check `.env.local` exists and has correct values
- Restart terminal after creating `.env.local`

**"Table does not exist" error:**
- Make sure you ran the SQL migration in Step 3
- Check Supabase → Table Editor to verify tables exist

**"Unauthorized" when accessing admin:**
- Verify `user_profiles` table has your user with `role = 'admin'`
- Check the UUID matches the one in `auth.users`

**Migration script errors:**
- Ensure database tables are created first (Step 3)
- Check that JSON files exist in `app/*/toursData.json`

---

For detailed instructions, see: `SETUP_INSTRUCTIONS.md`

