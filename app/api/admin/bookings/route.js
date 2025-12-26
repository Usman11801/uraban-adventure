import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// GET - List all bookings with filters
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
    const travelDate = searchParams.get('travel_date')
    const categoryId = searchParams.get('category_id')
    const paymentStatus = searchParams.get('payment_status')
    const bookingStatus = searchParams.get('booking_status')

    const supabase = createServiceClient()
    let query = supabase
      .from('bookings')
      .select(`
        *,
        package:packages(id, name, category_id, category:categories(name)),
        guide:guides(id, name, phone)
      `)
      .order('created_at', { ascending: false })

    if (startDate) {
      query = query.gte('booking_date', startDate)
    }

    if (endDate) {
      query = query.lte('booking_date', endDate)
    }

    if (travelDate) {
      query = query.eq('travel_date', travelDate)
    }

    if (paymentStatus) {
      query = query.eq('payment_status', paymentStatus)
    }

    if (bookingStatus) {
      query = query.eq('booking_status', bookingStatus)
    }

    if (categoryId) {
      query = query.eq('package.category_id', categoryId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ bookings: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

