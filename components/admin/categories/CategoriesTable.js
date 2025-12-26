"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import DataTable from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import { useState } from 'react'

export default function CategoriesTable({ categories }) {
  const router = useRouter()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category)
    setShowDeleteModal(true)
    setDeleteError('')
  }

  const confirmDelete = async () => {
    if (!categoryToDelete) return

    try {
      const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category')
      }

      router.refresh()
      setShowDeleteModal(false)
      setCategoryToDelete(null)
    } catch (err) {
      setDeleteError(err.message)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Category Name',
      render: (value, row) => (
        <div>
          <div style={{ fontWeight: '700', marginBottom: '4px', fontSize: '15px', color: '#1C231F' }}>{value}</div>
          <div style={{ fontSize: '13px', color: '#484848' }}>/{row.slug}</div>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (value) => (
        <span style={{ fontSize: '14px', color: '#484848', fontWeight: '500' }}>
          {value || '—'}
        </span>
      ),
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (value) => (
        <StatusBadge status={value ? 'active' : 'inactive'} type="status" />
      ),
    },
  ]

  const actions = (row) => (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
      <Link
        href={`/admin/categories/${row.id}`}
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
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 4px 12px rgba(99,171,69,0.4)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 2px 8px rgba(99,171,69,0.3)'
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
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)'
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)'
        }}
      >
        🗑️ Delete
      </button>
    </div>
  )

  return (
    <>
      <DataTable
        columns={columns}
        data={categories}
        onRowClick={(row) => router.push(`/admin/categories/${row.id}`)}
        actions={actions}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '15px', color: '#1C231F' }}>
              Confirm Deletion
            </h3>
            <p style={{ marginBottom: '25px', color: '#484848' }}>
              Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
            </p>
            {deleteError && (
              <p style={{ color: '#c53030', marginBottom: '15px', fontSize: '14px' }}>
                {deleteError}
              </p>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#e2e8f0',
                  color: '#4a5568',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '10px 20px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
