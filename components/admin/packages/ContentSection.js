"use client"

import FormField from '@/components/admin/ui/FormField'
import { useState, useEffect } from 'react'

export default function ContentSection({ formData, updateField }) {
  // Convert JSON to arrays for easier management
  const convertToArray = (data) => {
    if (!data) return ['']
    if (Array.isArray(data)) return data.length > 0 ? data : ['']
    if (typeof data === 'object') {
      const arr = Object.values(data)
      return arr.length > 0 ? arr : ['']
    }
    return [String(data)]
  }

  const [inclusions, setInclusions] = useState(convertToArray(formData.inclusions))
  const [excluded, setExcluded] = useState(convertToArray(formData.excluded))
  const [additionalInfo, setAdditionalInfo] = useState(convertToArray(formData.additional_info))
  const [itinerary, setItinerary] = useState(
    formData.itinerary && Array.isArray(formData.itinerary) 
      ? formData.itinerary 
      : formData.itinerary && typeof formData.itinerary === 'object'
      ? Object.entries(formData.itinerary).map(([key, value]) => ({
          question: typeof value === 'object' ? (value.title || value.question || key) : key,
          answer: typeof value === 'object' ? (value.answer || value.description || value.content || '') : String(value)
        }))
      : [{ question: '', answer: '' }]
  )

  // Update parent formData when local state changes
  useEffect(() => {
    updateField('inclusions', inclusions.filter(item => item.trim() !== ''))
  }, [inclusions])

  useEffect(() => {
    updateField('excluded', excluded.filter(item => item.trim() !== ''))
  }, [excluded])

  useEffect(() => {
    updateField('additional_info', additionalInfo.filter(item => item.trim() !== ''))
  }, [additionalInfo])

  useEffect(() => {
    updateField('itinerary', itinerary.filter(item => item.question.trim() !== '' || item.answer.trim() !== ''))
  }, [itinerary])

  const addListItem = (setter, currentList) => {
    setter([...currentList, ''])
  }

  const removeListItem = (setter, currentList, index) => {
    if (currentList.length > 1) {
      setter(currentList.filter((_, i) => i !== index))
    }
  }

  const updateListItem = (setter, currentList, index, value) => {
    const newList = [...currentList]
    newList[index] = value
    setter(newList)
  }

  const addItineraryItem = () => {
    setItinerary([...itinerary, { question: '', answer: '' }])
  }

  const removeItineraryItem = (index) => {
    if (itinerary.length > 1) {
      setItinerary(itinerary.filter((_, i) => i !== index))
    }
  }

  const updateItineraryItem = (index, field, value) => {
    const newItinerary = [...itinerary]
    newItinerary[index] = { ...newItinerary[index], [field]: value }
    setItinerary(newItinerary)
  }

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#1C231F', fontFamily: 'var(--heading-font)' }}>
        Content
      </h2>

      <FormField
        label="Description"
        name="description"
        type="textarea"
        value={formData.description}
        onChange={(e) => updateField('description', e.target.value)}
        required
        rows={4}
        placeholder="Short description for listing pages"
      />

      <FormField
        label="Detailed Description"
        name="description2"
        type="textarea"
        value={formData.description2}
        onChange={(e) => updateField('description2', e.target.value)}
        rows={6}
        placeholder="Detailed description for package details page"
      />

      {/* Inclusions */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          color: '#1C231F',
          fontSize: '15px',
          fontWeight: '600',
          fontFamily: 'var(--heading-font)',
        }}>
          Package Inclusions
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {inclusions.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                flexShrink: 0,
              }}>
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(setInclusions, inclusions, index, e.target.value)}
                placeholder={`Inclusion ${index + 1}`}
                style={{
                  flex: 1,
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
              {inclusions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem(setInclusions, inclusions, index)}
                  style={{
                    padding: '10px 14px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              )}
              {index === inclusions.length - 1 && (
                <button
                  type="button"
                  onClick={() => addListItem(setInclusions, inclusions)}
                  style={{
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(99,171,69,0.3)',
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Excluded */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          color: '#1C231F',
          fontSize: '15px',
          fontWeight: '600',
          fontFamily: 'var(--heading-font)',
        }}>
          Excluded (Optional)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {excluded.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #F7921E 0%, #e67e1a 100%)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                flexShrink: 0,
              }}>
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(setExcluded, excluded, index, e.target.value)}
                placeholder={`Excluded item ${index + 1}`}
                style={{
                  flex: 1,
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
              {excluded.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem(setExcluded, excluded, index)}
                  style={{
                    padding: '10px 14px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              )}
              {index === excluded.length - 1 && (
                <button
                  type="button"
                  onClick={() => addListItem(setExcluded, excluded)}
                  style={{
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(99,171,69,0.3)',
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          color: '#1C231F',
          fontSize: '15px',
          fontWeight: '600',
          fontFamily: 'var(--heading-font)',
        }}>
          Additional Information (Optional)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {additionalInfo.map((item, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                flexShrink: 0,
              }}>
                {index + 1}
              </span>
              <input
                type="text"
                value={item}
                onChange={(e) => updateListItem(setAdditionalInfo, additionalInfo, index, e.target.value)}
                placeholder={`Additional info ${index + 1}`}
                style={{
                  flex: 1,
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
              {additionalInfo.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem(setAdditionalInfo, additionalInfo, index)}
                  style={{
                    padding: '10px 14px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              )}
              {index === additionalInfo.length - 1 && (
                <button
                  type="button"
                  onClick={() => addListItem(setAdditionalInfo, additionalInfo)}
                  style={{
                    padding: '10px 14px',
                    background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    boxShadow: '0 2px 8px rgba(99,171,69,0.3)',
                    flexShrink: 0,
                  }}
                >
                  +
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Itinerary */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{
          display: 'block',
          marginBottom: '12px',
          color: '#1C231F',
          fontSize: '15px',
          fontWeight: '600',
          fontFamily: 'var(--heading-font)',
        }}>
          Itinerary (Question & Answer)
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {itinerary.map((item, index) => (
            <div key={index} style={{
              padding: '20px',
              border: '1px solid #E9E9E9',
              borderRadius: '12px',
              background: '#F9F9F7',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: '600',
                }}>
                  {index + 1}
                </span>
                {itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItineraryItem(index)}
                    style={{
                      padding: '8px 12px',
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => updateItineraryItem(index, 'question', e.target.value)}
                  placeholder="Question / Title"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #E9E9E9',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
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
                <textarea
                  value={item.answer}
                  onChange={(e) => updateItineraryItem(index, 'answer', e.target.value)}
                  placeholder="Answer / Description"
                  rows={3}
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
            </div>
          ))}
          <button
            type="button"
            onClick={addItineraryItem}
            style={{
              padding: '14px 20px',
              background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(99,171,69,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span>+</span>
            <span>Add Question & Answer</span>
          </button>
        </div>
      </div>
    </div>
  )
}
