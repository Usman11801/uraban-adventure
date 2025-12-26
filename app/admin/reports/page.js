"use client"

import { useState, useEffect } from 'react'
import SalesReport from '@/components/admin/reports/SalesReport'
import CategoryReport from '@/components/admin/reports/CategoryReport'
import PackageReport from '@/components/admin/reports/PackageReport'
import GuideReport from '@/components/admin/reports/GuideReport'

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('sales')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Set default date range (last 30 days)
  useEffect(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }, [])

  const tabs = [
    { id: 'sales', label: 'Sales Report' },
    { id: 'categories', label: 'By Category' },
    { id: 'packages', label: 'By Package' },
    { id: 'guides', label: 'By Guide' },
  ]

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Reports
      </h1>

      {/* Date Range Filter */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-end'
      }}>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#4a5568'
          }}>
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
        <div>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#4a5568'
          }}>
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '24px',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? '#667eea' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#4a5568',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #667eea' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '-2px',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      {activeTab === 'sales' && <SalesReport startDate={startDate} endDate={endDate} />}
      {activeTab === 'categories' && <CategoryReport startDate={startDate} endDate={endDate} />}
      {activeTab === 'packages' && <PackageReport startDate={startDate} endDate={endDate} />}
      {activeTab === 'guides' && <GuideReport startDate={startDate} endDate={endDate} />}
    </div>
  )
}

