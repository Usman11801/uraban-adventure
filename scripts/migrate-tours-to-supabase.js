/**
 * Migration script to migrate JSON tour data to Supabase
 * 
 * Usage:
 * 1. Set up your .env.local with Supabase credentials
 * 2. Run: node scripts/migrate-tours-to-supabase.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Verify it's actually the service_role key, not anon key
const keyParts = supabaseKey.split('.');
let isServiceRole = false;
if (keyParts.length === 3) {
  try {
    const payload = JSON.parse(Buffer.from(keyParts[1], 'base64').toString());
    isServiceRole = payload.role === 'service_role';
    if (!isServiceRole) {
      console.error('\n❌ CRITICAL ERROR: SUPABASE_SERVICE_ROLE_KEY is set to anon key, not service_role key!');
      console.error('   The migration script requires service_role key to bypass RLS policies.');
      console.error('\n📋 How to fix:');
      console.error('   1. Go to: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/settings/api');
      console.error('   2. Scroll to "Project API keys" section');
      console.error('   3. Find the "service_role" key (marked as "secret")');
      console.error('   4. Copy it (it\'s DIFFERENT from the anon key!)');
      console.error('   5. Update .env.local:');
      console.error('      SUPABASE_SERVICE_ROLE_KEY=<paste-service-role-key-here>');
      console.error('\n   The service_role key should have "service_role" in the JWT payload, not "anon"');
      console.error('   You can verify at: https://jwt.io\n');
      process.exit(1);
    }
  } catch (e) {
    console.warn('⚠️  Could not verify key type, proceeding anyway...');
  }
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Map page routes to display_page values
const pageMap = {
  'sight-see-list': 'sight-see-list',
  'tour-list': 'tour-list',
  'desert-resort-list': 'desert-resort-list',
  'theme-park-list': 'theme-park-list',
  'buggy-bike-list': 'buggy-bike-list',
  'private-tour-list': 'private-tour-list',
  'executive-tour-list': 'executive-tour-list',
  'combo-deal-list': 'combo-deal-list',
  'water-park-list': 'water-park-list',
  'sky-tour-list': 'sky-tour-list',
  'sea-advantucher-list': 'sea-advantucher-list',
  'dhow-cruise-list': 'dhow-cruise-list',
};

async function createCategoryIfNotExists(name) {
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Check if category exists
  const { data: existing, error: selectError } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (selectError && selectError.code !== 'PGRST116') {
    console.error(`Error checking category ${name}:`, selectError);
    return null;
  }

  if (existing) {
    return existing.id;
  }

  // Create category
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      slug,
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    if (error.code === '42501') {
      console.error(`\n❌ RLS Error creating category "${name}":`);
      console.error('   This means you\'re using the anon key instead of service_role key.');
      console.error('   Please update SUPABASE_SERVICE_ROLE_KEY in .env.local with the correct service_role key.');
      console.error('   Get it from: https://app.supabase.com/project/oukeozfmfuygqfgmhpos/settings/api\n');
    } else {
      console.error(`Error creating category ${name}:`, error);
    }
    return null;
  }

  console.log(`✅ Created category: ${name}`);
  return data.id;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

async function migrateTour(tour, displayPage, categoryId) {
  const slug = generateSlug(tour.title || tour.name);
  
  // Check if package already exists
  const { data: existing } = await supabase
    .from('packages')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existing) {
    console.log(`Package already exists: ${tour.title || tour.name}`);
    return existing.id;
  }

  const packageData = {
    category_id: categoryId,
    name: tour.title || tour.name,
    slug,
    description: tour.description || '',
    description2: tour.description2 || null,
    base_price: parseFloat(tour.price || 0),
    discount_price: null,
    currency: tour.currency || 'AED',
    status: 'active',
    display_page: displayPage,
    display_section: 'main',
    badge: tour.badge || null,
    rating: Math.round(parseFloat(tour.rating) || 5), // Ensure integer rating
    average_rating: tour.averageRating || null,
    total_reviews: tour.totalReviews || (tour.reviews?.length || 0),
    location: tour.location || 'UAE',
    duration: tour.duration || null,
    guests: tour.guests || null,
    image: tour.image || '',
    image1: tour.image1 || null,
    image2: tour.image2 || null,
    image3: tour.image3 || null,
    image4: tour.image4 || null,
    image5: tour.image5 || null,
    inclusions: tour.inclusions || tour.pick || {},
    excluded: tour.excluded || null,
    additional_info: tour.additional_info || null,
    itinerary: tour.itinerary || null,
  };

  const { data, error } = await supabase
    .from('packages')
    .insert(packageData)
    .select()
    .single();

  if (error) {
    if (error.code === '42501') {
      console.error(`\n❌ RLS Error creating package "${tour.title || tour.name}":`);
      console.error('   This means you\'re using the anon key instead of service_role key.');
      console.error('   Please update SUPABASE_SERVICE_ROLE_KEY in .env.local\n');
    } else {
      console.error(`Error creating package ${tour.title || tour.name}:`, error);
    }
    return null;
  }

  console.log(`✅ Created package: ${tour.title || tour.name}`);

  // Migrate reviews
  if (tour.reviews && Array.isArray(tour.reviews)) {
    for (const review of tour.reviews) {
      await supabase
        .from('reviews')
        .insert({
          package_id: data.id,
          name: review.name || 'Anonymous',
          rating: review.rating || 5,
          comment: review.comment || '',
          services_rating: review.services || null,
          guides_rating: review.guides || null,
          price_rating: review.price || null,
          date: review.date || null,
          is_approved: true,
        });
    }
    console.log(`  Migrated ${tour.reviews.length} reviews`);
  }

  return data.id;
}

async function migratePage(pageRoute) {
  const jsonPath = path.join(process.cwd(), 'app', pageRoute, 'toursData.json');
  
  if (!fs.existsSync(jsonPath)) {
    console.log(`Skipping ${pageRoute}: toursData.json not found`);
    return;
  }

  console.log(`\nMigrating ${pageRoute}...`);
  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const tours = jsonData.tours || [];

  if (tours.length === 0) {
    console.log(`  No tours found in ${pageRoute}`);
    return;
  }

  // Create or get category for this page
  const categoryName = pageRoute.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  const categoryId = await createCategoryIfNotExists(categoryName);

  if (!categoryId) {
    console.error(`  Failed to create/get category for ${pageRoute}`);
    return;
  }

  // Migrate tours
  const displayPage = pageMap[pageRoute] || pageRoute;
  let successCount = 0;
  
  for (const tour of tours) {
    const packageId = await migrateTour(tour, displayPage, categoryId);
    if (packageId) {
      successCount++;
    }
  }

  console.log(`  Migrated ${successCount}/${tours.length} tours from ${pageRoute}`);
}

async function main() {
  console.log('Starting migration...\n');

  // Migrate all pages
  for (const pageRoute of Object.keys(pageMap)) {
    await migratePage(pageRoute);
  }

  console.log('\nMigration completed!');
}

main().catch(console.error);

