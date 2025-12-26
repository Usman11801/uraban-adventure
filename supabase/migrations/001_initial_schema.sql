-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    description2 TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    currency TEXT DEFAULT 'AED',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    display_page TEXT NOT NULL,
    display_section TEXT NOT NULL,
    badge TEXT,
    rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    average_rating DECIMAL(3, 2),
    total_reviews INTEGER DEFAULT 0,
    location TEXT,
    duration TEXT,
    guests TEXT,
    image TEXT NOT NULL,
    image1 TEXT,
    image2 TEXT,
    image3 TEXT,
    image4 TEXT,
    image5 TEXT,
    inclusions JSONB NOT NULL DEFAULT '{}',
    excluded JSONB,
    additional_info JSONB,
    itinerary JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create package_addons table
CREATE TABLE package_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    services_rating INTEGER CHECK (services_rating >= 1 AND services_rating <= 5),
    guides_rating INTEGER CHECK (guides_rating >= 1 AND guides_rating <= 5),
    price_rating INTEGER CHECK (price_rating >= 1 AND price_rating <= 5),
    date TEXT,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create guides table
CREATE TABLE guides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    vehicle_details TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'busy', 'unavailable')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id TEXT NOT NULL UNIQUE,
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE RESTRICT,
    guide_id UUID REFERENCES guides(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    travel_date DATE NOT NULL,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    adults INTEGER NOT NULL DEFAULT 0,
    children INTEGER NOT NULL DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    payment_method TEXT,
    stripe_payment_id TEXT,
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
    special_requests TEXT,
    addons JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users profile table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_packages_category_id ON packages(category_id);
CREATE INDEX idx_packages_status ON packages(status);
CREATE INDEX idx_packages_display_page ON packages(display_page);
CREATE INDEX idx_packages_display_section ON packages(display_section);
CREATE INDEX idx_packages_slug ON packages(slug);
CREATE INDEX idx_package_addons_package_id ON package_addons(package_id);
CREATE INDEX idx_reviews_package_id ON reviews(package_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_bookings_package_id ON bookings(package_id);
CREATE INDEX idx_bookings_guide_id ON bookings(guide_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_travel_date ON bookings(travel_date);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_booking_id ON bookings(booking_id);
CREATE INDEX idx_guides_status ON guides(status);
CREATE INDEX idx_guides_availability_status ON guides(availability_status);
CREATE INDEX idx_user_profiles_role ON user_profiles(role);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_package_addons_updated_at BEFORE UPDATE ON package_addons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_guides_updated_at BEFORE UPDATE ON guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate package average rating and total reviews
CREATE OR REPLACE FUNCTION update_package_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE packages
    SET 
        average_rating = (
            SELECT COALESCE(AVG(rating::DECIMAL), 0)
            FROM reviews
            WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
            AND is_approved = true
        ),
        total_reviews = (
            SELECT COUNT(*)
            FROM reviews
            WHERE package_id = COALESCE(NEW.package_id, OLD.package_id)
            AND is_approved = true
        )
    WHERE id = COALESCE(NEW.package_id, OLD.package_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger to update package ratings when reviews change
CREATE TRIGGER update_package_ratings_on_review
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_package_ratings();

-- Helper function to check if user is admin (bypasses RLS to avoid recursion)
-- This function uses SECURITY DEFINER to bypass RLS policies
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

-- Grant execute permission
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO anon;

-- Function to generate unique booking_id (trigger function)
CREATE OR REPLACE FUNCTION generate_booking_id()
RETURNS TRIGGER AS $$
DECLARE
    new_booking_id TEXT;
    date_part TEXT;
    random_part TEXT;
BEGIN
    -- Only generate if booking_id is null or empty
    IF NEW.booking_id IS NULL OR NEW.booking_id = '' THEN
        date_part := TO_CHAR(NOW(), 'YYYYMMDD');
        random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        new_booking_id := 'BK-' || date_part || '-' || random_part;
        
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM bookings WHERE booking_id = new_booking_id) LOOP
            random_part := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
            new_booking_id := 'BK-' || date_part || '-' || random_part;
        END LOOP;
        
        NEW.booking_id := new_booking_id;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-generate booking_id
CREATE TRIGGER generate_booking_id_trigger
    BEFORE INSERT ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION generate_booking_id();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Categories: Public read for active categories, admin full access
CREATE POLICY "Public can view active categories"
    ON categories FOR SELECT
    USING (is_active = true);

CREATE POLICY "Admins can manage categories"
    ON categories FOR ALL
    USING (is_admin(auth.uid()));

-- Note: service_role key bypasses RLS automatically, but adding explicit policy for clarity

-- Packages: Public read for active packages, admin full access
CREATE POLICY "Public can view active packages"
    ON packages FOR SELECT
    USING (status = 'active');

CREATE POLICY "Admins can manage packages"
    ON packages FOR ALL
    USING (is_admin(auth.uid()));

-- Note: service_role key automatically bypasses RLS for all operations

-- Package Addons: Public read for active addons of active packages, admin full access
CREATE POLICY "Public can view active addons"
    ON package_addons FOR SELECT
    USING (
        is_active = true AND
        EXISTS (
            SELECT 1 FROM packages
            WHERE packages.id = package_addons.package_id
            AND packages.status = 'active'
        )
    );

CREATE POLICY "Admins can manage addons"
    ON package_addons FOR ALL
    USING (is_admin(auth.uid()));

-- Reviews: Public can view approved reviews, admin full access
CREATE POLICY "Public can view approved reviews"
    ON reviews FOR SELECT
    USING (is_approved = true);

CREATE POLICY "Admins can manage reviews"
    ON reviews FOR ALL
    USING (is_admin(auth.uid()));

-- Guides: Admin only access
CREATE POLICY "Admins can manage guides"
    ON guides FOR ALL
    USING (is_admin(auth.uid()));

-- Bookings: Users can view their own bookings, admin full access
CREATE POLICY "Users can view own bookings"
    ON bookings FOR SELECT
    USING (
        customer_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        OR
        is_admin(auth.uid())
    );

CREATE POLICY "Public can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can manage bookings"
    ON bookings FOR ALL
    USING (is_admin(auth.uid()));

-- User Profiles: Users can view their own profile
-- Note: Admin access is handled via service_role key in API routes, not RLS
CREATE POLICY "Users can view own profile"
    ON user_profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (id = auth.uid());

