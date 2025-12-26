"use client"

import { useState, useEffect } from 'react'

export default function CategoryReport({ startDate, endDate }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!startDate || !endDate) return
      
      setLoading(true)
      try {
        const params = new URLSearchParams({ start_date: startDate, end_date: endDate })
        const response = await fetch(`/api/admin/reports/categories?${params}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error('Failed to fetch category report:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [startDate, endDate])

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
  }

  if (!data || !data.categories || data.categories.length === 0) {
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
        Sales by Category
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data.categories.map((cat) => (
          <div
            key={cat.category_id}
            style={{
              padding: '16px',
              background: '#f7fafc',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{cat.category_name}</div>
                <div style={{ fontSize: '12px', color: '#718096' }}>
                  {cat.booking_count} booking{cat.booking_count !== 1 ? 's' : ''}
                </div>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1a202c' }}>
                AED {cat.total_sales.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

