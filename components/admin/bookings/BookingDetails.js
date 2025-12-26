"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import FormField from '@/components/admin/ui/FormField'
import { formatDate } from '@/lib/utils/dateFormat'

export default function BookingDetails({ booking, guides }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    payment_status: booking.payment_status,
    booking_status: booking.booking_status,
    guide_id: booking.guide_id || '',
  })

  const handleUpdate = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update booking')
      }

      router.refresh()
      alert('Booking updated successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAssignGuide = async (guideId) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}/assign-guide`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guide_id: guideId || null }),
      })

      if (!response.ok) {
        throw new Error('Failed to assign guide')
      }

      router.refresh()
      alert('Guide assignment updated!')
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      <div>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1a202c' }}>
            Booking Information
          </h2>

          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Booking ID</label>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>{booking.booking_id}</div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Package</label>
              <div style={{ fontSize: '16px', color: '#1a202c' }}>{booking.package?.name || 'N/A'}</div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Customer</label>
              <div style={{ fontSize: '16px', color: '#1a202c' }}>{booking.customer_name}</div>
              <div style={{ fontSize: '14px', color: '#718096' }}>{booking.customer_email}</div>
              <div style={{ fontSize: '14px', color: '#718096' }}>{booking.customer_phone}</div>
              {booking.gender && (
                <div style={{ fontSize: '14px', color: '#718096', marginTop: '4px' }}>
                  Gender: {booking.gender === 'he' ? 'He' : booking.gender === 'she' ? 'She' : booking.gender}
                </div>
              )}
              {booking.nationality && (
                <div style={{ fontSize: '14px', color: '#718096' }}>
                  Nationality: {booking.nationality}
                </div>
              )}
              {booking.hotel_name && (
                <div style={{ fontSize: '14px', color: '#718096' }}>
                  Hotel/Pickup: {booking.hotel_name}
                </div>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Travel Date</label>
                <div style={{ fontSize: '16px', color: '#1a202c' }}>
                  {formatDate(booking.travel_date)}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Booking Date</label>
                <div style={{ fontSize: '16px', color: '#1a202c' }}>
                  {formatDate(booking.booking_date)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Adults</label>
                <div style={{ fontSize: '16px', color: '#1a202c' }}>{booking.adults}</div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Children</label>
                <div style={{ fontSize: '16px', color: '#1a202c' }}>{booking.children}</div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Total Amount</label>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c' }}>
                AED {parseFloat(booking.total_amount).toFixed(2)}
              </div>
            </div>

            {booking.special_requests && (
              <div>
                <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Special Requests</label>
                <div style={{ fontSize: '14px', color: '#1a202c', padding: '12px', background: '#f7fafc', borderRadius: '6px' }}>
                  {booking.special_requests}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fed7d7',
            color: '#c53030',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1a202c' }}>
            Update Booking
          </h2>

          <FormField
            label="Payment Status"
            name="payment_status"
            type="select"
            value={formData.payment_status}
            onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'paid', label: 'Paid' },
              { value: 'failed', label: 'Failed' },
              { value: 'refunded', label: 'Refunded' },
            ]}
          />

          <FormField
            label="Booking Status"
            name="booking_status"
            type="select"
            value={formData.booking_status}
            onChange={(e) => setFormData({ ...formData, booking_status: e.target.value })}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'confirmed', label: 'Confirmed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'completed', label: 'Completed' },
            ]}
          />

          <button
            onClick={handleUpdate}
            disabled={loading}
            style={{
              padding: '12px 24px',
              background: loading ? '#a0aec0' : '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginTop: '16px'
            }}
          >
            {loading ? 'Updating...' : 'Update Booking'}
          </button>
        </div>
      </div>

      <div>
        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1a202c' }}>
            Current Status
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Payment Status</label>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge status={booking.payment_status} type="payment" />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#718096', fontWeight: '500' }}>Booking Status</label>
              <div style={{ marginTop: '4px' }}>
                <StatusBadge status={booking.booking_status} type="booking" />
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1a202c' }}>
            Assign Guide
          </h2>

          {booking.guide && (
            <div style={{
              padding: '12px',
              background: '#f7fafc',
              borderRadius: '6px',
              marginBottom: '16px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Current Guide</div>
              <div>{booking.guide.name}</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>{booking.guide.phone}</div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button
              onClick={() => handleAssignGuide(null)}
              disabled={loading || !booking.guide_id}
              style={{
                padding: '8px 16px',
                background: booking.guide_id ? '#fed7d7' : '#e2e8f0',
                color: booking.guide_id ? '#742a2a' : '#718096',
                border: 'none',
                borderRadius: '6px',
                cursor: loading || !booking.guide_id ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              Unassign Guide
            </button>

            {guides.map((guide) => (
              <button
                key={guide.id}
                onClick={() => handleAssignGuide(guide.id)}
                disabled={loading || booking.guide_id === guide.id}
                style={{
                  padding: '12px',
                  background: booking.guide_id === guide.id ? '#c6f6d5' : 'white',
                  color: booking.guide_id === guide.id ? '#22543d' : '#1a202c',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: '500' }}>{guide.name}</div>
                  <div style={{ fontSize: '12px', color: '#718096' }}>{guide.phone}</div>
                </div>
                {booking.guide_id === guide.id && <span>✓</span>}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

