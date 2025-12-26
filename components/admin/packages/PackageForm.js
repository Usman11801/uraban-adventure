"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FormField from '@/components/admin/ui/FormField'
import BasicInfoSection from '@/components/admin/packages/BasicInfoSection'
import ContentSection from '@/components/admin/packages/ContentSection'
import GallerySection from '@/components/admin/packages/GallerySection'
import AddonsSection from '@/components/admin/packages/AddonsSection'
import ReviewsSection from '@/components/admin/packages/ReviewsSection'

export default function PackageForm({ packageData, categories: initialCategories }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEdit = !!packageData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('basic')
  const [categories, setCategories] = useState(initialCategories || [])
  const [selectedAddonIds, setSelectedAddonIds] = useState([])
  const [newAddons, setNewAddons] = useState([])
  const [pendingReviews, setPendingReviews] = useState([])

  // Check for tab query parameter on mount
  useEffect(() => {
    const tabParam = searchParams?.get('tab')
    if (tabParam && ['basic', 'content', 'gallery', 'addons', 'reviews'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Fetch categories dynamically to get the latest list (including newly added ones)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/admin/categories')
        const data = await response.json()
        if (data.categories) {
          // Filter to only active categories and sort by name
          const activeCategories = data.categories
            .filter(cat => cat.is_active)
            .sort((a, b) => a.name.localeCompare(b.name))
          setCategories(activeCategories)
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error)
        // Keep initial categories if fetch fails
      }
    }

    fetchCategories()

    // Refresh categories when window regains focus (e.g., after adding category in another tab)
    const handleFocus = () => {
      fetchCategories()
    }
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const [formData, setFormData] = useState({
    category_id: packageData?.category_id || '',
    name: packageData?.name || '',
    slug: packageData?.slug || '',
    description: packageData?.description || '',
    description2: packageData?.description2 || '',
    base_price: packageData?.base_price || '',
    discount_price: packageData?.discount_price || '',
    currency: packageData?.currency || 'AED',
    status: packageData?.status || 'active',
    display_section: packageData?.display_section || '',
    badge: packageData?.badge || '',
    rating: packageData?.rating || 5,
    location: packageData?.location || '',
    duration: packageData?.duration || '',
    guests: packageData?.guests || '',
    image: packageData?.image || '',
    image1: packageData?.image1 || '',
    image2: packageData?.image2 || '',
    image3: packageData?.image3 || '',
    image4: packageData?.image4 || '',
    image5: packageData?.image5 || '',
    inclusions: packageData?.inclusions || {},
    excluded: packageData?.excluded || null,
    additional_info: packageData?.additional_info || null,
    itinerary: packageData?.itinerary || null,
  })

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'content', label: 'Content' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'addons', label: 'Add-ons' },
    { id: 'reviews', label: 'Reviews' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = isEdit
        ? `/api/admin/packages/${packageData.id}`
        : '/api/admin/packages'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save package')
      }

      // If creating a new package, link selected addons and save reviews
      if (!isEdit) {
        const packageId = data.package?.id || data.id
        if (packageId) {
          const errors = []

          // Link selected addons to the new package (only if they're not already linked to another package)
          if (selectedAddonIds.length > 0) {
            try {
              const linkResults = await Promise.allSettled(
                selectedAddonIds.map(addonId =>
                  fetch(`/api/admin/addons/${addonId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ package_id: packageId, is_active: true }),
                  })
                )
              )
              
              // Check for any failures
              linkResults.forEach((result, index) => {
                if (result.status === 'rejected') {
                  console.error(`Failed to link addon ${selectedAddonIds[index]}:`, result.reason)
                  errors.push(`Failed to link addon ${selectedAddonIds[index]}`)
                } else if (!result.value.ok) {
                  console.error(`Failed to link addon ${selectedAddonIds[index]}`)
                  errors.push(`Failed to link addon ${selectedAddonIds[index]}`)
                }
              })
            } catch (err) {
              console.error('Failed to link addons:', err)
              errors.push('Failed to link some addons')
            }
          }

          // Save new addons created before package was saved
          if (newAddons.length > 0) {
            try {
              const addonResults = await Promise.allSettled(
                newAddons.map(addon =>
                  fetch(`/api/admin/packages/${packageId}/addons`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: addon.name,
                      description: addon.description || '',
                      image: addon.image || null,
                      adult_price: addon.adult_price || 0,
                      child_price: addon.child_price || 0,
                      is_active: addon.is_active !== undefined ? addon.is_active : true,
                    }),
                  })
                )
              )
              
              // Check for any failures
              addonResults.forEach((result, index) => {
                if (result.status === 'rejected') {
                  console.error(`Failed to create addon "${newAddons[index].name}":`, result.reason)
                  errors.push(`Failed to create addon "${newAddons[index].name}"`)
                } else if (!result.value.ok) {
                  result.value.json().then(errData => {
                    console.error(`Failed to create addon "${newAddons[index].name}":`, errData.error)
                    errors.push(`Failed to create addon "${newAddons[index].name}": ${errData.error}`)
                  })
                }
              })
            } catch (err) {
              console.error('Failed to save new addons:', err)
              errors.push('Failed to save some addons')
            }
          }

          // Save pending reviews
          if (pendingReviews.length > 0) {
            try {
              const reviewResults = await Promise.allSettled(
                pendingReviews.map(review =>
                  fetch(`/api/admin/packages/${packageId}/reviews`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      name: review.name,
                      rating: review.rating || 5,
                      comment: review.comment || '',
                      services_rating: review.services_rating || null,
                      guides_rating: review.guides_rating || null,
                      price_rating: review.price_rating || null,
                      date: review.date || null,
                      is_approved: review.is_approved !== undefined ? review.is_approved : false,
                    }),
                  })
                )
              )
              
              // Check for any failures
              reviewResults.forEach((result, index) => {
                if (result.status === 'rejected') {
                  console.error(`Failed to create review for "${pendingReviews[index].name}":`, result.reason)
                  errors.push(`Failed to create review for "${pendingReviews[index].name}"`)
                } else if (!result.value.ok) {
                  result.value.json().then(errData => {
                    console.error(`Failed to create review for "${pendingReviews[index].name}":`, errData.error)
                    errors.push(`Failed to create review for "${pendingReviews[index].name}": ${errData.error}`)
                  })
                }
              })
            } catch (err) {
              console.error('Failed to save reviews:', err)
              errors.push('Failed to save some reviews')
            }
          }

          // Show errors if any occurred
          if (errors.length > 0) {
            console.warn('Some addons/reviews failed to save:', errors)
            // Don't throw error, just log - package was created successfully
          }

          router.push(`/admin/packages/${packageId}?tab=addons`)
          router.refresh()
        } else {
          router.push('/admin/packages')
          router.refresh()
        }
      } else {
        router.push('/admin/packages')
        router.refresh()
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit}>
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
            type="button"
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

      {/* Tab Content */}
      <div style={{
        background: 'white',
        borderRadius: '8px',
        padding: '24px',
        border: '1px solid #e2e8f0',
        marginBottom: '24px'
      }}>
        {activeTab === 'basic' && (
          <BasicInfoSection
            formData={formData}
            updateField={updateField}
            categories={categories}
          />
        )}

        {activeTab === 'content' && (
          <ContentSection
            formData={formData}
            updateField={updateField}
          />
        )}

        {activeTab === 'gallery' && (
          <GallerySection
            formData={formData}
            updateField={updateField}
          />
        )}

        {activeTab === 'addons' && (
          <AddonsSection
            packageId={packageData?.id}
            addons={packageData?.addons || []}
            onSelectedAddonsChange={setSelectedAddonIds}
            onNewAddonsChange={setNewAddons}
            newAddons={newAddons}
            setNewAddons={setNewAddons}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsSection
            packageId={packageData?.id}
            reviews={packageData?.reviews || []}
            onReviewsChange={setPendingReviews}
            newReviews={pendingReviews}
            setNewReviews={setPendingReviews}
          />
        )}
      </div>

      {/* Submit Button */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
          {loading ? 'Saving...' : isEdit ? 'Update Package' : 'Create Package'}
        </button>
      </div>
    </form>
  )
}

