"use client"

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'

export default function PackageTable({ packages, categories, searchParams }) {
  const router = useRouter()
  const searchParamsHook = useSearchParams()

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParamsHook.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/admin/packages?${params.toString()}`)
  }

  const columns = [
    {
      key: 'name',
      label: 'Package Name',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: '600', marginBottom: '4px' }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#718096' }}>
            {row.category?.name || 'No category'}
          </div>
        </div>
      ),
    },
    {
      key: 'display_section',
      label: 'Display Section',
      render: (value) => {
        const displayText = value === 'category' ? 'Category' : value === 'top-tour-and-category' ? 'Top Tour & Category' : value
        return (
          <span style={{ fontSize: '12px', color: '#4a5568' }}>{displayText}</span>
        )
      },
    },
    {
      key: 'base_price',
      label: 'Price',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: '600' }}>
            {row.currency} {parseFloat(value).toFixed(2)}
          </div>
          {row.discount_price && (
            <div style={{ fontSize: '12px', color: '#48bb78' }}>
              Discount: {row.currency} {parseFloat(row.discount_price).toFixed(2)}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => <StatusBadge status={value} type="status" />,
    },
  ]

  const handleDelete = async (packageId, packageName) => {
    if (!confirm(`Are you sure you want to delete "${packageName}"? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete package')
      }

      router.refresh()
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  }

  const actions = (row) => (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <Link
        href={`/admin/packages/${row.id}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
          color: 'white',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(99,171,69,0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px rgba(99,171,69,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(99,171,69,0.3)';
        }}
      >
        ✏️ Edit
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation()
          handleDeleteClick(row)
        }}
        style={{
          padding: '8px 16px',
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)';
        }}
      >
        🗑️ Delete
      </button>
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
        <div style={{ flex: '1', minWidth: '200px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#1C231F',
                fontFamily: 'var(--heading-font)',
              }}>
                Search
              </label>
              <input
                type="text"
                placeholder="Search packages..."
                defaultValue={searchParams?.search || ''}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParamsHook.toString())
                  if (e.target.value) {
                    params.set('search', e.target.value)
                  } else {
                    params.delete('search')
                  }
                  router.push(`/admin/packages?${params.toString()}`)
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'white',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9';
                  e.target.style.boxShadow = 'none';
                }}
              />
        </div>

        <div style={{ minWidth: '150px' }}>
              <label style={{
                display: 'block',
                marginBottom: '10px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#1C231F',
                fontFamily: 'var(--heading-font)',
              }}>
                Category
              </label>
              <select
                value={searchParams?.category_id || ''}
                onChange={(e) => handleFilterChange('category_id', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45';
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9';
                  e.target.style.boxShadow = 'none';
                }}
              >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
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
            Status
          </label>
          <select
            value={searchParams?.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white'
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

      </div>

      <DataTable
        columns={columns}
        data={packages}
        onRowClick={(row) => router.push(`/admin/packages/${row.id}`)}
        actions={actions}
      />
    </div>
  )
}

