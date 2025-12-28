import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { sendGuideAssignmentEmail } from '@/lib/loops/email'
import { NextResponse } from 'next/server'

// POST - Assign guide to booking
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
    const { guide_id } = await request.json()
    const supabase = createServiceClient()

    // Get current booking to check if guide was previously assigned
    const { data: currentBooking } = await supabase
      .from('bookings')
      .select('guide_id')
      .eq('id', id)
      .single()

    // If guide_id is null, unassign guide
    const updateData = { guide_id: guide_id || null }

    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        package:packages(*),
        guide:guides(*)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Send guide assignment email only if a guide is being assigned (not unassigned)
    if (guide_id && data.guide && data.guide.email) {
      try {
        console.log(`Guide assigned to booking ${id}. Sending email to guide...`)
        
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
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

