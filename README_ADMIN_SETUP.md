# Admin Panel Setup Guide

## Prerequisites

1. Node.js 18+ installed
2. A Supabase project created
3. Supabase credentials

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Supabase SSR utilities for Next.js

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe (for future use)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 3. Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. This will create all necessary tables, indexes, triggers, and RLS policies

### 4. Create Admin User

After running the migration, create an admin user:

1. Go to Authentication > Users in Supabase dashboard
2. Create a new user with email/password
3. Note the user's UUID
4. Run this SQL in the SQL Editor:

```sql
INSERT INTO user_profiles (id, email, role)
VALUES ('<user-uuid>', '<user-email>', 'admin');
```

Replace `<user-uuid>` and `<user-email>` with the actual values.

### 5. Migrate Existing Data (Optional)

If you have existing JSON tour data, run the migration script:

```bash
node scripts/migrate-tours-to-supabase.js
```

This will:
- Create categories from page names
- Migrate all tours from JSON files
- Preserve reviews, images, and all data structure

### 6. Start Development Server

```bash
npm run dev
```

### 7. Access Admin Panel

Navigate to: `http://localhost:3000/admin/login`

Login with the admin credentials you created.

## Admin Panel Features

- **Dashboard**: Overview of packages, bookings, revenue
- **Packages**: Full CRUD with tabs for basic info, display config, content, gallery, addons, reviews
- **Categories**: Manage tour categories
- **Bookings**: View and manage all bookings, assign guides
- **Guides**: Manage guides/drivers
- **Reports**: Sales reports by date range, category, package, and guide

## Database Schema

The system uses the following main tables:

- `categories` - Tour categories
- `packages` - Tour packages
- `package_addons` - Add-ons for packages
- `reviews` - Customer reviews
- `guides` - Guides/drivers
- `bookings` - Customer bookings
- `user_profiles` - Extended user profiles with roles

## API Routes

### Admin Routes (Protected)
- `/api/admin/packages/*` - Package management
- `/api/admin/categories/*` - Category management
- `/api/admin/bookings/*` - Booking management
- `/api/admin/guides/*` - Guide management
- `/api/admin/reports/*` - Reports

### Public Routes
- `/api/packages` - Get active packages (filtered by page/section)
- `/api/packages/[slug]` - Get single package by slug
- `/api/categories` - Get active categories
- `/api/bookings` - Create booking (POST)

## Notes

- All admin routes are protected by middleware
- RLS policies ensure data security
- The system automatically calculates package ratings from reviews
- Booking IDs are auto-generated in format: `BK-YYYYMMDD-XXXX`

## Future Enhancements

- Stripe payment integration (structure ready)
- Image upload to Supabase Storage
- Email notifications
- Advanced reporting features

