-- Add additional fields to bookings table for customer information
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS nationality TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS hotel_name TEXT;

-- Update special_requests to be more flexible
-- (Already exists, no change needed)

