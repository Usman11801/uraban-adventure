-- Update booking_status constraint to allow 'pending' status
ALTER TABLE bookings
DROP CONSTRAINT IF EXISTS bookings_booking_status_check;

ALTER TABLE bookings
ADD CONSTRAINT bookings_booking_status_check 
CHECK (booking_status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Update default booking_status to 'pending' for new bookings
ALTER TABLE bookings
ALTER COLUMN booking_status SET DEFAULT 'pending';

