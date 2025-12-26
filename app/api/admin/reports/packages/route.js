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
        package:packages(id, name)
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

    // Group by package
    const packageSales = {}
    data?.forEach(booking => {
      const packageId = booking.package?.id || 'unknown'
      const packageName = booking.package?.name || 'Unknown Package'
      
      if (!packageSales[packageId]) {
        packageSales[packageId] = {
          package_id: packageId,
          package_name: packageName,
          total_sales: 0,
          booking_count: 0,
        }
      }
      
      packageSales[packageId].total_sales += parseFloat(booking.total_amount || 0)
      packageSales[packageId].booking_count += 1
    })

    return NextResponse.json({
      packages: Object.values(packageSales).sort((a, b) => b.total_sales - a.total_sales),
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

