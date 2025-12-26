import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// GET - Get all reviews for a package
export async function GET(request, { params }) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = params
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('package_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ reviews: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Create review for package
export async function POST(request, { params }) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const {
      name,
      rating,
      comment,
      services_rating,
      guides_rating,
      price_rating,
      date,
      is_approved = false,
    } = body

    if (!name || !rating || !comment) {
      return NextResponse.json(
        { error: 'Name, rating, and comment are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Ensure package_id is set to the route parameter (cannot be overridden)
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        package_id: id, // Always use the package ID from the route
        name,
        rating: parseInt(rating),
        comment,
        services_rating: services_rating ? parseInt(services_rating) : null,
        guides_rating: guides_rating ? parseInt(guides_rating) : null,
        price_rating: price_rating ? parseInt(price_rating) : null,
        date,
        is_approved,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ review: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

