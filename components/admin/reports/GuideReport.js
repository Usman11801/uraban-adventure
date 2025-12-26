"use client"

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils/dateFormat'

export default function GuideReport({ startDate, endDate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return
      
      setLoading(true)
      try {
        const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
        const response = await fetch(`/api/admin/reports/guides?${params}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch guide report:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  if (!data || !data.guides || data.guides.length === 0) {
    return <div style={{ padding: '40px', textAlign: 'center', color: '#718096' }}>No data available</div>
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e2e8f0',
    }}>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1a202c' }}>
        Bookings by Guide
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.guides.map((guide) => (
          <div
            key={guide.guide_id}
            style={{
              padding: '16px',
              background: '#f7fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>{guide.guide_name}</div>
              <div style={{ fontSize: '12px', color: '#718096' }}>{guide.guide_phone}</div>
              <div style={{ fontSize: '14px', color: '#4a5568', marginTop: '8px' }}>
                {guide.booking_count} booking{guide.booking_count !== 1 ? 's' : ''}
              </div>
            </div>
            {guide.bookings.length > 0 && (
              <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Bookings:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {guide.bookings.map((booking, idx) => (
                    <div key={idx} style={{ fontSize: '12px', color: '#4a5568' }}>
                      {booking.booking_id} - {formatDate(booking.travel_date)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

