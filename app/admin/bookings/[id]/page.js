import { createServiceClient } from '@/lib/supabase/server'
import BookingDetails from '@/components/admin/bookings/BookingDetails'
import { notFound } from 'next/navigation'

export default async function BookingDetailPage({ params }) {
  const supabase = createServiceClient()
  const { id } = params

  const [bookingResult, guidesResult] = await Promise.all([
    supabase
      .from('bookings')
      .select(`
        *,
        package:packages(*, category:categories(*)),
        guide:guides(*)
      `)
      .eq('id', id)
      .single(),
    supabase
      .from('guides')
      .select('id, name, phone, availability_status')
      .eq('status', 'active')
      .order('name'),
  ])

  if (bookingResult.error || !bookingResult.data) {
    notFound()
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Booking Details
      </h1>
      <BookingDetails
        booking={bookingResult.data}
        guides={guidesResult.data || []}
      />
    </div>
  )
}

