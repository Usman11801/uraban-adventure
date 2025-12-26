"use client"

import { useState, useEffect } from 'react'
import { formatDate } from '@/lib/utils/dateFormat'

export default function ReviewsSection({ packageId, reviews: initialReviews, onReviewsChange, newReviews: parentNewReviews, setNewReviews: setParentNewReviews }) {
  const [reviews, setReviews] = useState(initialReviews || [])
  const [newReviews, setNewReviews] = useState(parentNewReviews || []) // New reviews created before package is saved
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null) // For editing items in newReviews array

  // Sync with parent state when it changes
  useEffect(() => {
    if (parentNewReviews !== undefined) {
      setNewReviews(parentNewReviews)
    }
  }, [parentNewReviews])
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    services_rating: '',
    guides_rating: '',
    price_rating: '',
    date: '',
    is_approved: false,
  })

  const loadReviews = async () => {
    if (!packageId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/packages/${packageId}/reviews`)
      const data = await response.json()
      if (data.reviews) {
        setReviews(data.reviews)
      }
    } catch (error) {
      console.error('Failed to load reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (packageId) {
      loadReviews()
    }
  }, [packageId])

  // Notify parent of new reviews change
  useEffect(() => {
    if (!packageId) {
      if (setParentNewReviews) {
        setParentNewReviews(newReviews)
      }
      if (onReviewsChange) {
        onReviewsChange(newReviews)
      }
    }
  }, [newReviews, packageId, onReviewsChange, setParentNewReviews])

  // Handle creating new review (for new packages - add to list, don't save yet)
  const handleCreateNewReview = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    if (!formData.name || !formData.comment) {
      alert('Please fill in name and comment')
      return false
    }

    const newReview = {
      id: editingIndex !== null ? newReviews[editingIndex].id : `temp-${Date.now()}`,
      name: formData.name,
      rating: parseInt(formData.rating) || 5,
      comment: formData.comment,
      services_rating: formData.services_rating ? parseInt(formData.services_rating) : null,
      guides_rating: formData.guides_rating ? parseInt(formData.guides_rating) : null,
      price_rating: formData.price_rating ? parseInt(formData.price_rating) : null,
      date: formData.date || '',
      is_approved: formData.is_approved,
      created_at: new Date().toISOString(),
    }

    if (editingIndex !== null) {
      // Update existing item in list
      const updated = [...newReviews]
      updated[editingIndex] = newReview
      setNewReviews(updated)
      setEditingIndex(null)
    } else {
      // Add new item to list
      setNewReviews([...newReviews, newReview])
    }

    // Reset form and close it (review is now in the list)
    setFormData({
      name: '',
      rating: 5,
      comment: '',
      services_rating: '',
      guides_rating: '',
      price_rating: '',
      date: '',
      is_approved: false,
    })
    setShowForm(false)
    setEditingIndex(null)
    return false
  }

  // Handle saving review (for existing packages - save to DB immediately)
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!packageId) {
      // For new packages, use handleCreateNewReview
      handleCreateNewReview(e)
      return
    }

    // If packageId exists, save to database
    setLoading(true)
    try {
      const url = editingIndex !== null && reviews[editingIndex]?.id
        ? `/api/admin/reviews/${reviews[editingIndex].id}`
        : `/api/admin/packages/${packageId}/reviews`
      
      const method = editingIndex !== null && reviews[editingIndex]?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to save review')
      }

      await loadReviews()
      setShowForm(false)
      setEditingIndex(null)
      setFormData({
        name: '',
        rating: 5,
        comment: '',
        services_rating: '',
        guides_rating: '',
        price_rating: '',
        date: '',
        is_approved: false,
      })
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (review, index) => {
    setEditingIndex(index)
    setFormData({
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      services_rating: review.services_rating || '',
      guides_rating: review.guides_rating || '',
      price_rating: review.price_rating || '',
      date: review.date || '',
      is_approved: review.is_approved,
    })
    setShowForm(true)
  }

  const handleDelete = async (id, index) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    // If no packageId, just remove from newReviews array
    if (!packageId) {
      const updated = newReviews.filter((_, i) => i !== index)
      setNewReviews(updated)
      return
    }

    // If packageId exists, delete from database
    try {
      const response = await fetch(`/api/admin/reviews/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete review')
      }

      await loadReviews()
    } catch (error) {
      alert(error.message)
    }
  }

  const toggleApproval = async (review, index) => {
    // If no packageId, update in newReviews array
    if (!packageId) {
      const updated = [...newReviews]
      updated[index] = { ...updated[index], is_approved: !updated[index].is_approved }
      setNewReviews(updated)
      return
    }

    // If packageId exists, update in database
    try {
      const response = await fetch(`/api/admin/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_approved: !review.is_approved }),
      })

      if (!response.ok) {
        throw new Error('Failed to update review')
      }

      await loadReviews()
    } catch (error) {
      alert(error.message)
    }
  }

  const allNewReviews = !packageId ? newReviews : []

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          color: '#1C231F', 
          margin: 0,
          fontFamily: 'var(--heading-font)',
        }}>
          Package Reviews
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm)
            setEditingIndex(null)
            setFormData({
              name: '',
              rating: 5,
              comment: '',
              services_rating: '',
              guides_rating: '',
              price_rating: '',
              date: '',
              is_approved: false,
            })
          }}
          style={{
            padding: '12px 24px',
            background: showForm ? 'linear-gradient(135deg, #718096 0%, #4a5568 100%)' : 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: showForm ? 'none' : '0 2px 8px rgba(99,171,69,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span style={{ fontSize: '18px' }}>+</span>
          {showForm ? 'Cancel' : 'Add Review'}
        </button>
      </div>

      {/* Show newly created reviews (for new packages) */}
      {!packageId && allNewReviews.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1C231F' }}>
            New Reviews (will be saved when package is created)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {allNewReviews.map((review, index) => (
              <div
                key={review.id}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #63AB45',
                  boxShadow: '0 2px 8px rgba(99,171,69,0.1)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '16px', color: '#1C231F' }}>
                      {review.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                      {review.date || formatDate(review.created_at)}
                    </div>
                    <div style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px' }}>
                      Rating: {'⭐'.repeat(review.rating)}
                      {review.services_rating && ` | Services: ${review.services_rating}/5`}
                      {review.guides_rating && ` | Guides: ${review.guides_rating}/5`}
                      {review.price_rating && ` | Price: ${review.price_rating}/5`}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    background: review.is_approved ? '#c6f6d5' : '#fed7d7',
                    color: review.is_approved ? '#22543d' : '#742a2a',
                  }}>
                    {review.is_approved ? 'Approved' : 'Pending'}
                  </div>
                </div>
                <div style={{ marginBottom: '12px', color: '#1a202c', fontSize: '14px' }}>{review.comment}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => toggleApproval(review, index)}
                    style={{
                      padding: '6px 12px',
                      background: review.is_approved ? '#fed7d7' : '#c6f6d5',
                      color: review.is_approved ? '#742a2a' : '#22543d',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    {review.is_approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEdit(review, index)}
                    style={{
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(review.id, index)}
                    style={{
                      padding: '6px 12px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '600',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show existing reviews (when editing) */}
      {packageId && reviews.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {reviews.map((review, index) => (
            <div
              key={review.id}
              style={{
                background: 'white',
                padding: '16px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '600', marginBottom: '4px' }}>{review.name}</div>
                  <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>
                    {review.date || new Date(review.created_at).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '14px', color: '#4a5568' }}>
                    Rating: {'⭐'.repeat(review.rating)}
                    {review.services_rating && ` | Services: ${review.services_rating}/5`}
                    {review.guides_rating && ` | Guides: ${review.guides_rating}/5`}
                    {review.price_rating && ` | Price: ${review.price_rating}/5`}
                  </div>
                </div>
                <div style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  background: review.is_approved ? '#c6f6d5' : '#fed7d7',
                  color: review.is_approved ? '#22543d' : '#742a2a',
                }}>
                  {review.is_approved ? 'Approved' : 'Pending'}
                </div>
              </div>
              <div style={{ marginBottom: '12px', color: '#1a202c' }}>{review.comment}</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => toggleApproval(review, index)}
                  style={{
                    padding: '6px 12px',
                    background: review.is_approved ? '#fed7d7' : '#c6f6d5',
                    color: review.is_approved ? '#742a2a' : '#22543d',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  {review.is_approved ? 'Unapprove' : 'Approve'}
                </button>
                <button
                  type="button"
                  onClick={() => handleEdit(review, index)}
                  style={{
                    padding: '6px 12px',
                    background: '#667eea',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(review.id, index)}
                  style={{
                    padding: '6px 12px',
                    background: '#f56565',
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
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Form */}
      {showForm && (
        <form 
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            if (packageId) {
              handleSubmit(e)
            } else {
              handleCreateNewReview(e)
            }
            return false
          }} 
          style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #E9E9E9',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1C231F',
          }}>
            {editingIndex !== null ? 'Edit Review' : 'Create New Review'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1C231F' }}>
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1C231F' }}>
                Rating (1-5) *
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1C231F' }}>
                Services Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.services_rating}
                onChange={(e) => setFormData({ ...formData, services_rating: e.target.value ? parseInt(e.target.value) : '' })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1C231F' }}>
                Guides Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.guides_rating}
                onChange={(e) => setFormData({ ...formData, guides_rating: e.target.value ? parseInt(e.target.value) : '' })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1C231F' }}>
                Price Rating (1-5)
              </label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.price_rating}
                onChange={(e) => setFormData({ ...formData, price_rating: e.target.value ? parseInt(e.target.value) : '' })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1C231F' }}>
                Date
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="2 days ago"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #E9E9E9',
                  borderRadius: '10px',
                  fontSize: '14px',
                  transition: 'all 0.3s ease',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#63AB45'
                  e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)'
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E9E9E9'
                  e.target.style.boxShadow = 'none'
                }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#1C231F' }}>
              Comment *
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid #E9E9E9',
                borderRadius: '10px',
                fontSize: '14px',
                resize: 'vertical',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#63AB45'
                e.target.style.boxShadow = '0 0 0 3px rgba(99,171,69,0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E9E9E9'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <input
                type="checkbox"
                checked={formData.is_approved}
                onChange={(e) => setFormData({ ...formData, is_approved: e.target.checked })}
              />
              Approved (visible on website)
            </label>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (packageId) {
                  handleSubmit(e)
                } else {
                  handleCreateNewReview(e)
                }
              }}
              disabled={loading}
              style={{
                padding: '12px 24px',
                background: loading ? '#a0aec0' : 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: loading ? 'none' : '0 2px 8px rgba(99,171,69,0.3)',
              }}
            >
              {loading ? 'Saving...' : editingIndex !== null ? 'Update Review' : 'Create Review'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingIndex(null)
                setFormData({
                  name: '',
                  rating: 5,
                  comment: '',
                  services_rating: '',
                  guides_rating: '',
                  price_rating: '',
                  date: '',
                  is_approved: false,
                })
              }}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#484848',
                border: '1px solid #E9E9E9',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Empty state */}
      {!showForm && reviews.length === 0 && allNewReviews.length === 0 && (
        <p style={{ color: '#718096', textAlign: 'center', padding: '40px' }}>
          No reviews yet. Click "Add Review" to create one.
        </p>
      )}
    </div>
  )
}
