-- Fix RLS recursion issue in user_profiles policies
-- Run this if you already ran 001_initial_schema.sql and got recursion errors

-- Drop problematic policies if they exist
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON user_profiles;

-- Create helper function to check admin status (bypasses RLS)
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- SECURITY DEFINER allows this function to bypass RLS
    SELECT role INTO user_role
    FROM user_profiles
    WHERE id = user_id;
    
    RETURN COALESCE(user_role = 'admin', false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;

-- Update all admin policies to use the helper function
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories"
    ON categories FOR ALL
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage packages" ON packages;
CREATE POLICY "Admins can manage packages"
    ON packages FOR ALL
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage addons" ON package_addons;
CREATE POLICY "Admins can manage addons"
    ON package_addons FOR ALL
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage reviews" ON reviews;
CREATE POLICY "Admins can manage reviews"
    ON reviews FOR ALL
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can manage guides" ON guides;
CREATE POLICY "Admins can manage guides"
    ON guides FOR ALL
    USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (
        customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        OR
        is_admin(auth.uid())
    );

DROP POLICY IF EXISTS "Admins can manage bookings" ON bookings;
CREATE POLICY "Admins can manage bookings"
    ON bookings FOR ALL
    USING (is_admin(auth.uid()));

