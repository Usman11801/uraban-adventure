-- Allow service_role to insert data for migration purposes
-- Note: service_role key should bypass RLS automatically, but these policies ensure it works

-- Categories: Allow service_role to insert/update/delete
CREATE POLICY IF NOT EXISTS "Service role can insert categories"
    ON categories FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can update categories"
    ON categories FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can delete categories"
    ON categories FOR DELETE
    TO service_role
    USING (true);

-- Packages: Allow service_role to insert/update/delete
CREATE POLICY IF NOT EXISTS "Service role can insert packages"
    ON packages FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can update packages"
    ON packages FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can delete packages"
    ON packages FOR DELETE
    TO service_role
    USING (true);

-- Reviews: Allow service_role to insert/update/delete
CREATE POLICY IF NOT EXISTS "Service role can insert reviews"
    ON reviews FOR INSERT
    TO service_role
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can update reviews"
    ON reviews FOR UPDATE
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Service role can delete reviews"
    ON reviews FOR DELETE
    TO service_role
    USING (true);

