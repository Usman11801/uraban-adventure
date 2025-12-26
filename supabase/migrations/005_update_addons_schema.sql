-- Add new fields to package_addons table for adult/child pricing and image
ALTER TABLE package_addons
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS adult_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS child_price DECIMAL(10, 2);

-- Update existing addons: set adult_price and child_price to price if they're null
UPDATE package_addons
SET adult_price = price, child_price = price
WHERE adult_price IS NULL OR child_price IS NULL;

-- Make price field nullable since we're using adult_price/child_price now
ALTER TABLE package_addons
ALTER COLUMN price DROP NOT NULL;

-- Make package_id nullable to allow creating addons before package exists
ALTER TABLE package_addons
ALTER COLUMN package_id DROP NOT NULL;

