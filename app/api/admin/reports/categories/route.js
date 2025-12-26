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
        total_amount,
        package:packages(category_id, category:categories(name))
      `)
      .eq('payment_status', 'paid')

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

    // Group by category
    const categorySales = {}
    data?.forEach(booking => {
      const categoryName = booking.package?.category?.name || 'Uncategorized'
      const categoryId = booking.package?.category_id || 'uncategorized'
      
      if (!categorySales[categoryId]) {
        categorySales[categoryId] = {
          category_id: categoryId,
          category_name: categoryName,
          total_sales: 0,
          booking_count: 0,
        }
      }
      
      categorySales[categoryId].total_sales += parseFloat(booking.total_amount || 0)
      categorySales[categoryId].booking_count += 1
    })

    return NextResponse.json({
      categories: Object.values(categorySales),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

