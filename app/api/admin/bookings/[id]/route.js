import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// GET - Get single booking
export async function GET(request, { params }) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = await params
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        package:packages(*, category:categories(*)),
        guide:guides(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      )
    }

    return NextResponse.json({ booking: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PUT - Update booking
export async function PUT(request, { params }) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const supabase = createServiceClient()

    const updateData = {}
    const allowedFields = [
      'customer_name', 'customer_email', 'customer_phone',
      'travel_date', 'adults', 'children', 'total_amount',
      'payment_status', 'payment_method', 'booking_status',
      'special_requests', 'addons', 'guide_id',
      'nationality', 'gender', 'hotel_name'
    ]

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (['adults', 'children'].includes(field)) {
          updateData[field] = parseInt(body[field])
        } else if (field === 'total_amount') {
          updateData[field] = parseFloat(body[field])
        } else if (field === 'travel_date' && body[field]) {
          // Ensure travel_date is properly formatted
          updateData[field] = body[field]
        } else if (field === 'guide_id' && body[field] === '') {
          // Handle empty guide_id (unassign guide)
          updateData[field] = null
        } else {
          updateData[field] = body[field]
        }
      }
    })

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        package:packages(*, category:categories(*)),
        guide:guides(*)
      `)
      .single()

    if (error) {
      console.error('Database update error:', error)
      return NextResponse.json(
        { error: error.message || 'Failed to update booking' },
        { status: 500 }
      )
    }

    return NextResponse.json({ booking: data })
  } catch (error) {
    console.error('Unexpected error in PUT /api/admin/bookings/[id]:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

