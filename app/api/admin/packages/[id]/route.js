import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// GET - Get single package
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
      .from('packages')
      .select(`
        *,
        category:categories(id, name, slug),
        addons:package_addons(*),
        reviews:reviews(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ package: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PUT - Update package
export async function PUT(request, { params }) {
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
    const supabase = createServiceClient()

    // Check if package exists
    const { data: existingPackage } = await supabase
      .from('packages')
      .select('id, slug')
      .eq('id', id)
      .single()

    if (!existingPackage) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // If slug is being changed, check for conflicts
    if (body.slug && body.slug !== existingPackage.slug) {
      const { data: slugConflict } = await supabase
        .from('packages')
        .select('id')
        .eq('slug', body.slug)
        .neq('id', id)
        .single()

      if (slugConflict) {
        return NextResponse.json(
          { error: 'Package with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData = {}
    const allowedFields = [
      'category_id', 'name', 'slug', 'description', 'description2',
      'base_price', 'discount_price', 'currency', 'status',
      'display_section', 'badge', 'rating', 'location', 'duration', 'guests',
      'image', 'image1', 'image2', 'image3', 'image4', 'image5',
      'inclusions', 'excluded', 'additional_info', 'itinerary'
    ]

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'base_price' || field === 'discount_price') {
          updateData[field] = body[field] ? parseFloat(body[field]) : null
        } else if (field === 'rating') {
          updateData[field] = parseInt(body[field])
        } else {
          updateData[field] = body[field]
        }
      }
    })

    const { data, error } = await supabase
      .from('packages')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ package: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE - Delete package
export async function DELETE(request, { params }) {
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

    // Check if package has bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('package_id', id)
      .limit(1)

    if (bookings && bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete package with existing bookings' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

