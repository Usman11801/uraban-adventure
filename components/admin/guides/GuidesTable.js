"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function GuidesTable({ guides }) {
  const router = useRouter()

  const handleDelete = async (guideId, guideName) => {
    if (!confirm(`Are you sure you want to delete "${guideName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/guides/${guideId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete guide')
      }

      router.refresh()
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Guide Name',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#718096' }}>{row.phone}</div>
          {row.email && (
            <div style={{ fontSize: '12px', color: '#718096' }}>{row.email}</div>
          )}
        </div>
      ),
    },
    {
      key: 'vehicle_details',
      label: 'Vehicle',
      render: (value) => (
        <span style={{ fontSize: '14px', color: '#4a5568' }}>
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} type="status" />,
    },
    {
      key: 'availability_status',
      label: 'Availability',
      render: (value) => <StatusBadge status={value} type="availability" />,
    },
  ]

  const actions = (row) => (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      <Link
        href={`/admin/guides/${row.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '6px 12px',
          background: '#667eea',
          color: 'white',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '12px',
        }}
      >
        Edit
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleDelete(row.id, row.name)
        }}
        style={{
          padding: '6px 12px',
          background: '#e53e3e',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        Delete
      </button>
    </div>
  )

  return (
    <DataTable
      columns={columns}
      data={guides || []}
      onRowClick={(row) => router.push(`/admin/guides/${row.id}`)}
      actions={actions}
    />
  )
}

