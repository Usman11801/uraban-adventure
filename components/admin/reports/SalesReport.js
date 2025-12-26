"use client"

import { useState, useEffect } from 'react'

export default function SalesReport({ startDate, endDate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return
      
      setLoading(true)
      try {
        const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
        const response = await fetch(`/api/admin/reports/sales?${params}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch sales report:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  if (!data) {
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
        Sales Report
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div style={{
          padding: '20px',
          background: '#f7fafc',
          borderRadius: '6px',
        }}>
          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Total Sales</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c' }}>
            AED {data.totalSales?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
          </div>
        </div>
        <div style={{
          padding: '20px',
          background: '#f7fafc',
          borderRadius: '6px',
        }}>
          <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Total Bookings</div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c' }}>
            {data.totalBookings || 0}
          </div>
        </div>
      </div>
    </div>
  )
}

