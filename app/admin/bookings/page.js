import { createServiceClient } from '@/lib/supabase/server'
import BookingTable from '@/components/admin/bookings/BookingTable'

export default async function BookingsPage({ searchParams }) {
  const supabase = createServiceClient()
  
  // Fetch categories for filter
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .eq('is_active', true)
    .order('name')

  // Build query
  let query = supabase
    .from('bookings')
    .select(`
      *,
      package:packages(id, name, category_id, category:categories(name))
    `)
    .order('created_at', { ascending: false })

  if (searchParams.start_date) {
    query = query.gte('booking_date', searchParams.start_date)
  }

  if (searchParams.end_date) {
    query = query.lte('booking_date', searchParams.end_date)
  }

  if (searchParams.travel_date) {
    query = query.eq('travel_date', searchParams.travel_date)
  }

  if (searchParams.payment_status) {
    query = query.eq('payment_status', searchParams.payment_status)
  }

  if (searchParams.booking_status) {
    query = query.eq('booking_status', searchParams.booking_status)
  }

  const { data: bookings, error } = await query

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Bookings
      </h1>

      <BookingTable
        bookings={bookings || []}
        categories={categories || []}
        searchParams={searchParams}
      />
    </div>
  )
}

