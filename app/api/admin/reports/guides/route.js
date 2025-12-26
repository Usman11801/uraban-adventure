import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

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
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    const supabase = createServiceClient()
    let query = supabase
      .from('bookings')
      .select(`
        id,
        booking_id,
        travel_date,
        guide:guides(id, name, phone)
      `)
      .not('guide_id', 'is', null)

    if (startDate) {
      query = query.gte('booking_date', startDate)
    }

    if (endDate) {
      query = query.lte('booking_date', endDate)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Group by guide
    const guideBookings = {}
    data?.forEach(booking => {
      if (!booking.guide) return
      
      const guideId = booking.guide.id
      
      if (!guideBookings[guideId]) {
        guideBookings[guideId] = {
          guide_id: guideId,
          guide_name: booking.guide.name,
          guide_phone: booking.guide.phone,
          booking_count: 0,
          bookings: [],
        }
      }
      
      guideBookings[guideId].booking_count += 1
      guideBookings[guideId].bookings.push({
        booking_id: booking.booking_id,
        travel_date: booking.travel_date,
      })
    })

    return NextResponse.json({
      guides: Object.values(guideBookings).sort((a, b) => b.booking_count - a.booking_count),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

