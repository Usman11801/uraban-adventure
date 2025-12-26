import { createServiceClient } from '@/lib/supabase/server'
import StatsCard from '@/components/admin/dashboard/StatsCard'
import RecentBookings from '@/components/admin/dashboard/RecentBookings'
import QuickActions from '@/components/admin/dashboard/QuickActions'

export default async function AdminDashboard() {
  const supabase = createServiceClient()

  // Fetch statistics
  const [packagesResult, bookingsResult, revenueResult, upcomingBookingsResult] = await Promise.all([
    supabase
      .from('packages')
      .select('id, status', { count: 'exact' }),
    supabase
      .from('bookings')
      .select('id', { count: 'exact' }),
    supabase
      .from('bookings')
      .select('total_amount')
      .eq('payment_status', 'paid'),
    supabase
      .from('bookings')
      .select('id, booking_id, customer_name, travel_date, package:packages(name)')
      .eq('booking_status', 'confirmed')
      .gte('travel_date', new Date().toISOString().split('T')[0])
      .lte('travel_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('travel_date', { ascending: true })
      .limit(10),
  ])

  const totalPackages = packagesResult.count || 0
  const activePackages = packagesResult.data?.filter(p => p.status === 'active').length || 0
  const inactivePackages = totalPackages - activePackages
  const totalBookings = bookingsResult.count || 0
  const totalRevenue = revenueResult.data?.reduce((sum, b) => sum + parseFloat(b.total_amount || 0), 0) || 0
  const upcomingBookings = upcomingBookingsResult.data || []

  return (
    <div style={{ padding: '0 8px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: '700', 
          marginBottom: '8px', 
          color: '#1C231F',
          fontFamily: 'var(--heading-font)',
        }}>
          Dashboard
        </h1>
        <p style={{
          color: '#484848',
          fontSize: '15px',
          margin: 0,
        }}>
          Welcome back! Here's what's happening with your tours today.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
        marginBottom: '40px'
      }}>
        <StatsCard
          title="Total Packages"
          value={totalPackages}
          subtitle={`${activePackages} active, ${inactivePackages} inactive`}
          icon="📦"
          color="#667eea"
        />
        <StatsCard
          title="Total Bookings"
          value={totalBookings}
          subtitle="All time"
          icon="📋"
          color="#48bb78"
        />
        <StatsCard
          title="Upcoming Bookings"
          value={upcomingBookings.length}
          subtitle="Next 7 days"
          icon="📅"
          color="#ed8936"
        />
        <StatsCard
          title="Total Revenue"
          value={`AED ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          subtitle="This month"
          icon="💰"
          color="#38b2ac"
        />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '28px',
        marginBottom: '40px'
      }} className="md:grid-cols-1">
        <RecentBookings bookings={upcomingBookings} />
        <QuickActions />
      </div>
    </div>
  )
}

