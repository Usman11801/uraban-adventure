"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormField from '@/components/admin/ui/FormField'

export default function GuideForm({ guideData }) {
  const router = useRouter()
  const isEdit = !!guideData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: guideData?.name || '',
    phone: guideData?.phone || '',
    email: guideData?.email || '',
    vehicle_details: guideData?.vehicle_details || '',
    status: guideData?.status || 'active',
    availability_status: guideData?.availability_status || 'available',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEdit
        ? `/api/admin/guides/${guideData.id}`
        : '/api/admin/guides'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save guide')
      }

      router.push('/admin/guides')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e2e8f0',
      maxWidth: '600px'
    }}>
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

      <FormField
        label="Guide Name"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <FormField
        label="Phone"
        name="phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <FormField
        label="Vehicle Details"
        name="vehicle_details"
        type="textarea"
        value={formData.vehicle_details}
        onChange={(e) => setFormData({ ...formData, vehicle_details: e.target.value })}
        rows={3}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <FormField
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />

        <FormField
          label="Availability Status"
          name="availability_status"
          type="select"
          value={formData.availability_status}
          onChange={(e) => setFormData({ ...formData, availability_status: e.target.value })}
          options={[
            { value: 'available', label: 'Available' },
            { value: 'busy', label: 'Busy' },
            { value: 'unavailable', label: 'Unavailable' },
          ]}
        />
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            padding: '12px 24px',
            background: 'white',
            color: '#4a5568',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
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
          }}
        >
          {loading ? 'Saving...' : isEdit ? 'Update Guide' : 'Create Guide'}
        </button>
      </div>
    </form>
  )
}

