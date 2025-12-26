import { createClient } from './server'

/**
 * Fetch packages from Supabase with optional filters
 * @param {Object} options - Filter options
 * @param {string} options.displayPage - Filter by display_page
 * @param {string} options.displaySection - Filter by display_section
 * @param {string} options.status - Filter by status (default: 'active')
 * @param {number} options.limit - Limit number of results
 * @returns {Promise<Array>} Array of packages
 */
export async function getPackages({
  displayPage = null,
  displaySection = null,
  status = 'active',
  limit = null,
} = {}) {
  const supabase = await createClient()

  let query = supabase
    .from('packages')
    .select(`
      *,
      category:categories(id, name, slug),
      addons:package_addons(*)
    `)
    .eq('status', status)
    .order('created_at', { ascending: false })

  if (displayPage) {
    query = query.eq('display_page', displayPage)
  }

  if (displaySection) {
    query = query.eq('display_section', displaySection)
  }

  if (limit) {
    query = query.limit(limit)
  }

  const { data: packages, error } = await query

  if (error) {
    console.error('Error fetching packages:', error)
    return []
  }

  // Transform packages to match expected format
  return packages?.map((pkg) => ({
    ...pkg,
    id: pkg.id,
    name: pkg.name,
    title: pkg.name, // For backward compatibility
    slug: pkg.slug,
    price: pkg.discount_price || pkg.base_price,
    base_price: pkg.base_price,
    discount_price: pkg.discount_price,
    currency: pkg.currency || 'AED',
    image: pkg.image,
    description: pkg.description,
    rating: pkg.rating || 5,
    totalReviews: pkg.total_reviews || 0,
    reviews: pkg.total_reviews || 0, // For backward compatibility
    badge: pkg.badge,
    location: pkg.location,
    duration: pkg.duration,
    guests: pkg.guests,
    addons: pkg.addons?.filter((addon) => addon.is_active) || [],
    // Calculate discount percentage if badge exists
    discount: pkg.badge ? parseInt(pkg.badge.replace('% Off', '').replace('%', '')) : null,
    originalPrice: pkg.discount_price && pkg.base_price ? pkg.base_price : null,
  })) || []
}

/**
 * Get package by slug
 * @param {string} slug - Package slug
 * @returns {Promise<Object|null>} Package object or null
 */
export async function getPackageBySlug(slug) {
  const supabase = await createClient()

  const { data: packageData, error } = await supabase
    .from('packages')
    .select(`
      *,
      category:categories(id, name, slug),
      addons:package_addons(*),
      reviews:reviews(*)
    `)
    .eq('slug', slug)
    .eq('status', 'active')
    .single()

  if (error || !packageData) {
    return null
  }

  // Transform package to match expected format
  return {
    ...packageData,
    id: packageData.id,
    name: packageData.name,
    title: packageData.name,
    slug: packageData.slug,
    price: packageData.discount_price || packageData.base_price,
    base_price: packageData.base_price,
    discount_price: packageData.discount_price,
    currency: packageData.currency || 'AED',
    image: packageData.image,
    description: packageData.description,
    description2: packageData.description2,
    rating: packageData.rating || 5,
    totalReviews: packageData.total_reviews || 0,
    reviews: packageData.total_reviews || 0,
    badge: packageData.badge,
    location: packageData.location,
    duration: packageData.duration,
    guests: packageData.guests,
    addons: packageData.addons?.filter((addon) => addon.is_active) || [],
    reviews: packageData.reviews?.filter((review) => review.is_approved) || [],
    inclusions: packageData.inclusions,
    excluded: packageData.excluded,
    additional_info: packageData.additional_info,
    itinerary: packageData.itinerary,
    discount: packageData.badge ? parseInt(packageData.badge.replace('% Off', '').replace('%', '')) : null,
    originalPrice: packageData.discount_price && packageData.base_price ? packageData.base_price : null,
  }
}

