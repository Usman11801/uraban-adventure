import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { sendGuideAssignmentEmail } from '@/lib/loops/email'
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

    // Get current booking to check if guide was previously assigned
    let previousGuideId = null
    if (body.guide_id !== undefined) {
      const { data: currentBooking } = await supabase
        .from('bookings')
        .select('guide_id')
        .eq('id', id)
        .single()
      previousGuideId = currentBooking?.guide_id
    }

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

    // Send guide assignment email only if a guide is being newly assigned (not unassigned)
    if (
      body.guide_id !== undefined && 
      body.guide_id && 
      body.guide_id !== '' && 
      data.guide && 
      data.guide.email &&
      previousGuideId !== body.guide_id
    ) {
      try {
        console.log(`Guide assigned to booking ${id} via PUT. Sending email to guide...`)
        
        const emailResult = await sendGuideAssignmentEmail({
          guideEmail: data.guide.email,
          guideName: data.guide.name,
          bookingId: data.booking_id || data.id,
          packageName: data.package?.name || 'Tour Package',
          customerName: data.customer_name,
          travelDate: data.travel_date,
          customerPhone: data.customer_phone,
          hotelName: data.hotel_name,
          adults: data.adults || 0,
          children: data.children || 0,
        })

        if (!emailResult.success) {
          console.error(`Failed to send guide assignment email for booking ${data.id}:`, emailResult.error)
          // Don't fail the assignment if email fails - just log the error
        } else {
          console.log(`Guide assignment email sent successfully to ${data.guide.email} for booking ${data.id}`)
        }
      } catch (emailError) {
        console.error('Error sending guide assignment email:', emailError)
        // Don't fail the assignment if email fails - just log the error
      }
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

