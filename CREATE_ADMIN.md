# Create Admin User

## Quick Setup

Run this command to create an admin user:

```bash
npm run create-admin <email> <password>
```

### Example:

```bash
npm run create-admin admin@example.com mypassword123
```

Or directly:

```bash
node scripts/create-admin-user.js admin@example.com mypassword123
```

## What It Does

1. ✅ Creates a user in Supabase Auth with the email and password
2. ✅ Auto-confirms the email (no email verification needed)
3. ✅ Creates a profile in `user_profiles` table with `role = 'admin'`
4. ✅ Shows you the login details

## Admin Login Route

**URL:** http://localhost:3000/admin/login

**Credentials:**
- Email: The email you provided
- Password: The password you provided

## If User Already Exists

If the email already exists:
- ✅ If already admin: Shows message that user is already admin
- ✅ If not admin: Updates the user to admin role
- ✅ If no profile: Creates admin profile

## Notes

- Supabase automatically hashes passwords (no manual hashing needed)
- The script uses service_role key to bypass RLS
- Email is auto-confirmed (no verification email sent)
- Password is stored securely by Supabase Auth

## Troubleshooting

**"User already exists" error:**
- The script handles this automatically
- It will update existing users to admin if needed

**"RLS policy violation" error:**
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set correctly in `.env.local`
- Service role key bypasses RLS automatically

**Can't login after creation:**
- Make sure the dev server is running: `npm run dev`
- Check that the email/password are correct
- Verify the user exists in Supabase Dashboard → Authentication → Users

