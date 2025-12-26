"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import { formatDate } from '@/lib/utils/dateFormat'

export default function BookingTable({ bookings, categories, searchParams }) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParamsHook.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/bookings?${params.toString()}`)
  }

  const columns = [
    {
      key: 'booking_id',
      label: 'Booking ID',
      render: (value, row) => (
        <div style={{ fontWeight: '600' }}>{value}</div>
      ),
    },
    {
      key: 'customer_name',
      label: 'Customer',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: '500', marginBottom: '4px' }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#718096' }}>{row.customer_email}</div>
          <div style={{ fontSize: '12px', color: '#718096' }}>{row.customer_phone}</div>
        </div>
      ),
    },
    {
      key: 'package',
      label: 'Package',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: '500' }}>{row.package?.name || 'N/A'}</div>
          <div style={{ fontSize: '12px', color: '#718096' }}>
            {row.package?.category?.name || 'No category'}
          </div>
        </div>
      ),
    },
    {
      key: 'travel_date',
      label: 'Travel Date',
      render: (value) => (
        <span>{formatDate(value)}</span>
      ),
    },
    {
      key: 'total_amount',
      label: 'Amount',
      render: (value) => (
        <span style={{ fontWeight: '600' }}>AED {parseFloat(value).toFixed(2)}</span>
      ),
    },
    {
      key: 'payment_status',
      label: 'Payment',
      render: (value) => <StatusBadge status={value} type="payment" />,
    },
    {
      key: 'booking_status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} type="booking" />,
    },
  ]

  const handleApprove = async (bookingId, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to approve this booking?')) return

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/approve`, {
        method: 'POST',
      })
      const data = await response.json()

      if (response.ok) {
        alert('Booking approved successfully!')
        router.refresh()
      } else {
        alert(data.error || 'Failed to approve booking')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  const handleReject = async (bookingId, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to reject this booking?')) return

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/reject`, {
        method: 'POST',
      })
      const data = await response.json()

      if (response.ok) {
        alert('Booking rejected successfully!')
        router.refresh()
      } else {
        alert(data.error || 'Failed to reject booking')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    }
  }

  const actions = (row) => (
    <div style={{ 
      display: 'flex', 
      gap: '8px', 
      justifyContent: 'flex-end', 
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      {row.booking_status === 'pending' && (
        <>
          <button
            onClick={(e) => handleApprove(row.id, e)}
            className="admin-action-btn admin-approve-btn"
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(72,187,120,0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(72,187,120,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(72,187,120,0.3)'
            }}
          >
            <span>✓</span>
            Approve
          </button>
          <button
            onClick={(e) => handleReject(row.id, e)}
            className="admin-action-btn admin-reject-btn"
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(245,101,101,0.3)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(245,101,101,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(245,101,101,0.3)'
            }}
          >
            <span>✕</span>
            Reject
          </button>
        </>
      )}
      <Link
        href={`/admin/bookings/${row.id}`}
        onClick={(e) => e.stopPropagation()}
        className="admin-action-btn admin-view-btn"
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #667eea 0%, #5568d3 100%)',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(102,126,234,0.3)',
          transition: 'all 0.3s ease',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102,126,234,0.4)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(102,126,234,0.3)'
        }}
      >
        <span>👁️</span>
        View
      </Link>
    </div>
  )

  return (
    <div>
      {/* Filters */}
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #e2e8f0',
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        alignItems: 'flex-end'
      }}>
        <div style={{ minWidth: '150px' }}>
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
            value={searchParams?.start_date || ''}
            onChange={(e) => handleFilterChange('start_date', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ minWidth: '150px' }}>
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
            value={searchParams?.end_date || ''}
            onChange={(e) => handleFilterChange('end_date', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{ minWidth: '150px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#4a5568'
          }}>
            Payment Status
          </label>
          <select
            value={searchParams?.payment_status || ''}
            onChange={(e) => handleFilterChange('payment_status', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div style={{ minWidth: '150px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontSize: '12px',
            fontWeight: '500',
            color: '#4a5568'
          }}>
            Booking Status
          </label>
          <select
            value={searchParams?.booking_status || ''}
            onChange={(e) => handleFilterChange('booking_status', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={bookings}
        onRowClick={(row) => router.push(`/admin/bookings/${row.id}`)}
        actions={actions}
      />
    </div>
  )
}

