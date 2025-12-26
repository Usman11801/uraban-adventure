import Link from 'next/link'
import { formatDate } from '@/lib/utils/dateFormat'

export default function RecentBookings({ bookings }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #E9E9E9',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '2px solid #E9E9E9',
      }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '700',
          margin: 0,
          color: '#1C231F',
          fontFamily: 'var(--heading-font)',
        }}>
          Upcoming Bookings
        </h2>
        <span style={{
          fontSize: '24px',
        }}>
          📅
        </span>
      </div>

      {bookings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#484848',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
          <p style={{ color: '#484848', fontSize: '15px', margin: 0, fontWeight: '500' }}>
            No upcoming bookings in the next 7 days
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {bookings.map((booking) => (
            <div
              key={booking.id}
              style={{
                padding: '16px 18px',
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #E9E9E9',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              className="recent-booking-item-hover"
            >
              <Link
                href={`/admin/bookings/${booking.id}`}
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: 0,
                      fontWeight: '700',
                      color: '#1C231F',
                      fontSize: '15px',
                      marginBottom: '6px',
                    }}>
                      {booking.booking_id}
                    </p>
                    <p style={{
                      margin: 0,
                      color: '#484848',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}>
                      <span>👤</span>
                      {booking.customer_name} • {booking.package?.name || 'N/A'}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(99,171,69,0.1) 0%, rgba(247,146,30,0.1) 100%)',
                    color: '#63AB45',
                    fontSize: '13px',
                    fontWeight: '600',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(99,171,69,0.2)',
                    whiteSpace: 'nowrap',
                  }}>
                    📅 {formatDate(booking.travel_date)}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      {bookings.length > 0 && (
        <Link
          href="/admin/bookings"
          className="admin-view-all-link"
          style={{
            display: 'block',
            marginTop: '20px',
            textAlign: 'center',
            color: '#63AB45',
            fontSize: '15px',
            fontWeight: '600',
            textDecoration: 'none',
            padding: '12px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(99,171,69,0.05) 0%, rgba(247,146,30,0.05) 100%)',
            border: '1px solid rgba(99,171,69,0.2)',
            transition: 'all 0.3s ease',
          }}
        >
          View All Bookings →
        </Link>
      )}
    </div>
  )
}

