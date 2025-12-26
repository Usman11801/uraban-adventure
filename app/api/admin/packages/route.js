import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// GET - List all packages with filters
export async function GET(request) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('category_id')
    const status = searchParams.get('status')
    const displayPage = searchParams.get('display_page')
    const search = searchParams.get('search')

    const supabase = createServiceClient()
    let query = supabase
      .from('packages')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order('created_at', { ascending: false })

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    if (displayPage) {
      query = query.eq('display_page', displayPage)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ packages: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Create new package
export async function POST(request) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      category_id,
      name,
      slug,
      description,
      description2,
      base_price,
      discount_price,
      currency = 'AED',
      status = 'active',
      display_section,
      badge,
      rating = 5,
      location,
      duration,
      guests,
      image,
      image1,
      image2,
      image3,
      image4,
      image5,
      inclusions = {},
      excluded,
      additional_info,
      itinerary,
    } = body

    // Validation
    if (!name || !slug || !description || !base_price || !display_section || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Check if slug already exists
    const { data: existingPackage } = await supabase
      .from('packages')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingPackage) {
      return NextResponse.json(
        { error: 'Package with this slug already exists' },
        { status: 400 }
      )
    }

    // Normalize JSONB fields - handle arrays and objects properly
    // inclusions is required, so use empty array if provided as array, or empty object if empty
    let finalInclusions = {}
    if (Array.isArray(inclusions)) {
      finalInclusions = inclusions.length > 0 ? inclusions : []
    } else if (inclusions && typeof inclusions === 'object' && inclusions !== null) {
      finalInclusions = Object.keys(inclusions).length > 0 ? inclusions : {}
    }
    
    // excluded, additional_info, itinerary are nullable - convert empty arrays to null
    const normalizedExcluded = Array.isArray(excluded) 
      ? (excluded.length > 0 ? excluded : null)
      : (excluded && typeof excluded === 'object' && excluded !== null && !Array.isArray(excluded))
      ? (Object.keys(excluded).length > 0 ? excluded : null)
      : null
    
    const normalizedAdditionalInfo = Array.isArray(additional_info) 
      ? (additional_info.length > 0 ? additional_info : null)
      : (additional_info && typeof additional_info === 'object' && additional_info !== null && !Array.isArray(additional_info))
      ? (Object.keys(additional_info).length > 0 ? additional_info : null)
      : null
    
    const normalizedItinerary = Array.isArray(itinerary) 
      ? (itinerary.length > 0 ? itinerary : null)
      : (itinerary && typeof itinerary === 'object' && itinerary !== null && !Array.isArray(itinerary))
      ? (Object.keys(itinerary).length > 0 ? itinerary : null)
      : null

    const { data, error } = await supabase
      .from('packages')
      .insert({
        category_id,
        name,
        slug,
        description,
        description2,
        base_price: parseFloat(base_price),
        discount_price: discount_price ? parseFloat(discount_price) : null,
        currency,
        status,
        display_section,
        badge,
        rating: parseInt(rating),
        location,
        duration,
        guests,
        image,
        image1: image1 || null,
        image2: image2 || null,
        image3: image3 || null,
        image4: image4 || null,
        image5: image5 || null,
        inclusions: finalInclusions,
        excluded: normalizedExcluded,
        additional_info: normalizedAdditionalInfo,
        itinerary: normalizedItinerary,
      })
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single()

    if (error) {
      console.error('Database insert error:', error)
      console.error('Insert data:', {
        category_id,
        name,
        slug,
        display_section,
        inclusions: finalInclusions,
        excluded: normalizedExcluded,
        additional_info: normalizedAdditionalInfo,
        itinerary: normalizedItinerary,
      })
      return NextResponse.json(
        { 
          error: error.message || 'Failed to create package',
          details: process.env.NODE_ENV === 'development' ? error : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json({ package: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

