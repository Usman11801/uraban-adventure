"use client"

import { useState, useEffect } from 'react'

export default function AddonsSection({ packageId, addons: initialAddons, onSelectedAddonsChange, onNewAddonsChange, newAddons: parentNewAddons, setNewAddons: setParentNewAddons }) {
  const [allAddons, setAllAddons] = useState([]) // All addons from all packages
  const [packageAddons, setPackageAddons] = useState(initialAddons || []) // Addons for this specific package
  const [newAddons, setNewAddons] = useState(parentNewAddons || []) // New addons created before package is saved
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingIndex, setEditingIndex] = useState(null) // For editing items in newAddons array
  const [selectedAddons, setSelectedAddons] = useState(new Set()) // Selected addon IDs for new packages

  // Sync with parent state when it changes
  useEffect(() => {
    if (parentNewAddons !== undefined) {
      setNewAddons(parentNewAddons)
    }
  }, [parentNewAddons])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    adult_price: '',
    child_price: '',
    is_active: true,
  })

  // Load all addons from all packages (for new package creation)
  const loadAllAddons = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/addons')
      const data = await response.json()
      if (data.addons) {
        setAllAddons(data.addons)
        // Pre-select addons that are already linked to this package (if editing)
        if (packageId) {
          const packageAddonIds = new Set(packageAddons.map(a => a.id))
          setSelectedAddons(packageAddonIds)
        }
      }
    } catch (error) {
      console.error('Failed to load all addons:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load addons for specific package (when editing)
  const loadPackageAddons = async () => {
    if (!packageId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/packages/${packageId}/addons`)
      const data = await response.json()
      if (data.addons) {
        setPackageAddons(data.addons)
        const activeIds = new Set(data.addons.filter(a => a.is_active).map(a => a.id))
        setSelectedAddons(activeIds)
      }
    } catch (error) {
      console.error('Failed to load package addons:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (packageId) {
      // Editing existing package: load package-specific addons
      loadPackageAddons()
    } else {
      // Creating new package: load all addons from all packages
      loadAllAddons()
    }
  }, [packageId])

  // Notify parent of new addons change
  useEffect(() => {
    if (!packageId) {
      if (setParentNewAddons) {
        setParentNewAddons(newAddons)
      }
      if (onNewAddonsChange) {
        onNewAddonsChange(newAddons)
      }
    }
  }, [newAddons, packageId, onNewAddonsChange, setParentNewAddons])

  // Notify parent of selected addons change
  useEffect(() => {
    if (onSelectedAddonsChange && !packageId) {
      onSelectedAddonsChange(Array.from(selectedAddons))
    }
  }, [selectedAddons, packageId, onSelectedAddonsChange])

  // Handle creating new addon (for new packages - add to list, don't save yet)
  const handleCreateNewAddon = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    // Validate name - ensure it's not the label text
    const nameValue = formData.name?.trim()
    if (!nameValue || nameValue === '' || nameValue === 'Name *') {
      alert('Please enter a valid addon name')
      return false
    }
    
    if (!formData.adult_price || parseFloat(formData.adult_price) < 0) {
      alert('Please enter a valid adult price')
      return false
    }
    
    if (!formData.child_price || parseFloat(formData.child_price) < 0) {
      alert('Please enter a valid child price')
      return false
    }

    const newAddon = {
      id: editingIndex !== null ? newAddons[editingIndex].id : `temp-${Date.now()}`,
      name: nameValue, // Use the validated name
      description: formData.description?.trim() || '',
      image: formData.image?.trim() || '',
      adult_price: parseFloat(formData.adult_price) || 0,
      child_price: parseFloat(formData.child_price) || 0,
      is_active: formData.is_active,
      price: parseFloat(formData.adult_price) || 0, // For backward compatibility
    }

    if (editingIndex !== null) {
      // Update existing item in list
      const updated = [...newAddons]
      updated[editingIndex] = newAddon
      setNewAddons(updated)
      setEditingIndex(null)
    } else {
      // Add new item to list
      setNewAddons([...newAddons, newAddon])
    }

    // Reset form and close it (addon is now in the list)
    setFormData({
      name: '',
      description: '',
      image: '',
      adult_price: '',
      child_price: '',
      is_active: true,
    })
    setShowForm(false)
    setEditingIndex(null)
    return false
  }

  // Handle saving addon (for existing packages - save to DB immediately)
  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!packageId) {
      // For new packages, use handleCreateNewAddon
      handleCreateNewAddon(e)
      return
    }
    
    // Validate form data
    if (!formData.name || formData.name.trim() === '' || formData.name === 'Name *') {
      alert('Please enter a valid addon name')
      return
    }
    
    if (!formData.adult_price || parseFloat(formData.adult_price) < 0) {
      alert('Please enter a valid adult price')
      return
    }
    
    if (!formData.child_price || parseFloat(formData.child_price) < 0) {
      alert('Please enter a valid child price')
      return
    }
    
    setLoading(true)
    try {
      const url = editingIndex !== null && packageAddons[editingIndex]?.id
        ? `/api/admin/addons/${packageAddons[editingIndex].id}`
        : `/api/admin/packages/${packageId}/addons`
      
      const method = editingIndex !== null && packageAddons[editingIndex]?.id ? 'PUT' : 'POST'

      // Ensure we're sending clean data
      const submitData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || '',
        image: formData.image?.trim() || null,
        adult_price: parseFloat(formData.adult_price) || 0,
        child_price: parseFloat(formData.child_price) || 0,
        is_active: formData.is_active !== undefined ? formData.is_active : true,
      }

      console.log('Submitting addon data:', submitData)

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save addon')
      }

      // Refresh addons list
      await loadPackageAddons()
      
      setShowForm(false)
      setEditingIndex(null)
      setFormData({ name: '', description: '', image: '', adult_price: '', child_price: '', is_active: true })
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (addon, index) => {
    setEditingIndex(index)
    setFormData({
      name: addon.name,
      description: addon.description || '',
      image: addon.image || '',
      adult_price: addon.adult_price || addon.price || '',
      child_price: addon.child_price || addon.price || '',
      is_active: addon.is_active,
    })
    setShowForm(true)
  }

  const handleDelete = async (id, index) => {
    if (!confirm('Are you sure you want to delete this addon?')) return

    // If no packageId, just remove from newAddons array
    if (!packageId) {
      const updated = newAddons.filter((_, i) => i !== index)
      setNewAddons(updated)
      return
    }

    // If packageId exists, delete from database
    try {
      const response = await fetch(`/api/admin/addons/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete addon')
      }

      // Refresh addons list
      await loadPackageAddons()
    } catch (error) {
      alert(error.message)
    }
  }

  const toggleAddonSelection = (addon) => {
    const newSelected = new Set(selectedAddons)
    if (newSelected.has(addon.id)) {
      newSelected.delete(addon.id)
    } else {
      newSelected.add(addon.id)
    }
    setSelectedAddons(newSelected)

    // If editing existing package, update addon active status
    if (packageId) {
      fetch(`/api/admin/addons/${addon.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: newSelected.has(addon.id) }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Failed to update addon')
          return loadPackageAddons()
        })
        .catch(error => {
          alert(error.message)
          setSelectedAddons(selectedAddons) // Revert on error
        })
    }
  }

  // Determine which addons to display
  const displayAddons = packageId ? packageAddons : allAddons
  const allNewAddons = !packageId ? newAddons : []

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px' 
      }}>
        <h2 style={{ 
          fontSize: '22px', 
          fontWeight: '700', 
          color: '#1C231F', 
          margin: 0,
          fontFamily: 'var(--heading-font)',
        }}>
          Package Add-ons
          {!packageId && <span style={{ fontSize: '14px', fontWeight: '400', color: '#718096', marginLeft: '8px' }}>
            (Select from existing or create new)
          </span>}
        </h2>
        <button
          type="button"
          onClick={() => {
            setShowForm(!showForm)
            setEditingIndex(null)
            setFormData({ name: '', description: '', image: '', adult_price: '', child_price: '', is_active: true })
          }}
          className="admin-primary-button"
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
          {showForm ? 'Cancel' : 'Create New Addon'}
        </button>
      </div>

      {/* Show existing addons from other packages (for new packages) */}
      {!packageId && displayAddons.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1C231F' }}>
            Select from Existing Addons
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            marginBottom: '24px',
          }}>
            {displayAddons.map((addon) => {
              const isSelected = selectedAddons.has(addon.id)
              const adultPrice = addon.adult_price || addon.price || 0
              const childPrice = addon.child_price || addon.price || 0
              
              return (
                <div
                  key={addon.id}
                  style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: isSelected ? '#63AB45' : '#E9E9E9',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {addon.image && (
                    <img
                      src={addon.image}
                      alt={addon.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        flexShrink: 0,
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAddonSelection(addon)}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: '#63AB45',
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', marginBottom: '4px', fontSize: '15px', color: '#1C231F' }}>
                      {addon.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#484848' }}>
                      Adult: AED {parseFloat(adultPrice).toFixed(2)} | Child: AED {parseFloat(childPrice).toFixed(2)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Show newly created addons (for new packages) */}
      {!packageId && allNewAddons.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px', color: '#1C231F' }}>
            New Addons (will be saved when package is created)
          </h3>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
          }}>
            {allNewAddons.map((addon, index) => (
              <div
                key={addon.id}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid #63AB45',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(99,171,69,0.1)',
                }}
              >
                {addon.image && (
                  <img
                    src={addon.image}
                    alt={addon.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '700', 
                    marginBottom: '6px',
                    fontSize: '16px',
                    color: '#1C231F',
                  }}>
                    {addon.name}
                  </div>
                  {addon.description && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#484848', 
                      marginBottom: '8px' 
                    }}>
                      {addon.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#1C231F' }}>
                    <span style={{ fontWeight: '600' }}>
                      Adult: <span style={{ color: '#0066cc' }}>AED {parseFloat(addon.adult_price).toFixed(2)}</span>
                    </span>
                    <span style={{ fontWeight: '600' }}>
                      Child: <span style={{ color: '#0066cc' }}>AED {parseFloat(addon.child_price).toFixed(2)}</span>
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(addon, index)}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addon.id, index)}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show existing addons for package (when editing) */}
      {packageId && displayAddons.length > 0 && (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          marginBottom: '24px',
        }}>
          {displayAddons.map((addon, index) => {
            const isSelected = selectedAddons.has(addon.id)
            const adultPrice = addon.adult_price || addon.price || 0
            const childPrice = addon.child_price || addon.price || 0
            
            return (
              <div
                key={addon.id}
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '2px solid',
                  borderColor: isSelected ? '#63AB45' : '#E9E9E9',
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected 
                    ? '0 4px 15px rgba(99,171,69,0.2)' 
                    : '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                {addon.image && (
                  <img
                    src={addon.image}
                    alt={addon.name}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleAddonSelection(addon)}
                  style={{
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    accentColor: '#63AB45',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '700', 
                    marginBottom: '6px',
                    fontSize: '16px',
                    color: '#1C231F',
                  }}>
                    {addon.name}
                  </div>
                  {addon.description && (
                    <div style={{ 
                      fontSize: '14px', 
                      color: '#484848', 
                      marginBottom: '8px' 
                    }}>
                      {addon.description}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#1C231F' }}>
                    <span style={{ fontWeight: '600' }}>
                      Adult: <span style={{ color: '#0066cc' }}>AED {parseFloat(adultPrice).toFixed(2)}</span>
                    </span>
                    <span style={{ fontWeight: '600' }}>
                      Child: <span style={{ color: '#0066cc' }}>AED {parseFloat(childPrice).toFixed(2)}</span>
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleEdit(addon, index)}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(addon.id, index)}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: '600',
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            )
          })}
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
              handleCreateNewAddon(e)
            }
            return false
          }} 
          style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
          padding: '24px',
          borderRadius: '12px',
          border: '1px solid #E9E9E9',
          marginBottom: '24px',
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '700',
            marginBottom: '20px',
            color: '#1C231F',
          }}>
            {editingIndex !== null ? 'Edit Addon' : 'Create New Addon'}
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#1C231F',
              }}>
                Name *
              </label>
              <input
                type="text"
                name="addon_name"
                id="addon_name"
                value={formData.name}
                onChange={(e) => {
                  const value = e.target.value
                  if (value !== 'Name *') {
                    setFormData({ ...formData, name: value })
                  }
                }}
                required
                placeholder="e.g., Food on Table"
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
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#1C231F',
              }}>
                Image URL
              </label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="/assets/images/addons/food.jpg"
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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#1C231F',
              }}>
                Adult Price (AED) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.adult_price}
                onChange={(e) => setFormData({ ...formData, adult_price: e.target.value })}
                required
                placeholder="100.00"
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
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontSize: '14px', 
                fontWeight: '600',
                color: '#1C231F',
              }}>
                Child Price (AED) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.child_price}
                onChange={(e) => setFormData({ ...formData, child_price: e.target.value })}
                required
                placeholder="100.00"
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
            <label style={{ 
              display: 'block', 
              marginBottom: '10px', 
              fontSize: '14px', 
              fontWeight: '600',
              color: '#1C231F',
            }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Optional description for this addon"
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

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                if (packageId) {
                  handleSubmit(e)
                } else {
                  handleCreateNewAddon(e)
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
              {loading ? 'Saving...' : editingIndex !== null ? 'Update Addon' : 'Create Addon'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setEditingIndex(null)
                setFormData({ name: '', description: '', image: '', adult_price: '', child_price: '', is_active: true })
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
      {!showForm && displayAddons.length === 0 && allNewAddons.length === 0 && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
          borderRadius: '12px',
          border: '1px solid #E9E9E9',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
          <p style={{ color: '#484848', fontSize: '15px', fontWeight: '500', marginBottom: '8px' }}>
            {!packageId ? 'No addons available' : 'No addons yet'}
          </p>
          <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
            {!packageId ? 'Create your first addon to get started' : 'Add addons to this package'}
          </p>
        </div>
      )}
    </div>
  )
}
