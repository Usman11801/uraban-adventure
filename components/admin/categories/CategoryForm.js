"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FormField from '@/components/admin/ui/FormField'

export default function CategoryForm({ categoryData }) {
  const router = useRouter()
  const isEdit = !!categoryData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: categoryData?.name || '',
    slug: categoryData?.slug || '',
    description: categoryData?.description || '',
    image: categoryData?.image || '',
    is_active: categoryData?.is_active !== undefined ? categoryData.is_active : true,
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEdit
        ? `/api/admin/categories/${categoryData.id}`
        : '/api/admin/categories'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save category')
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  // Auto-generate slug from name
  const handleNameChange = (value) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: prev.slug || value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    }))
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
        label="Category Name"
        name="name"
        value={formData.name}
        onChange={(e) => handleNameChange(e.target.value)}
        required
      />

      <FormField
        label="Slug"
        name="slug"
        value={formData.slug}
        onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
        required
        placeholder="category-slug"
      />

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows={4}
      />

      <FormField
        label="Image URL"
        name="image"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
        placeholder="https://example.com/image.jpg"
        helpText="Enter the full URL of the category image"
      />

      <FormField
        label="Status"
        name="is_active"
        type="select"
        value={formData.is_active ? 'true' : 'false'}
        onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
        options={[
          { value: 'true', label: 'Active' },
          { value: 'false', label: 'Inactive' },
        ]}
      />

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
          {loading ? 'Saving...' : isEdit ? 'Update Category' : 'Create Category'}
        </button>
      </div>
    </form>
  )
}

