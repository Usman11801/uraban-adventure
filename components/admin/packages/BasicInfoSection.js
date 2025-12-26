import FormField from '@/components/admin/ui/FormField'

const SECTION_OPTIONS = [
  { value: 'category', label: 'Category' },
  { value: 'top-tour-and-category', label: 'Top Tour and Category' },
]

export default function BasicInfoSection({ formData, updateField, categories }) {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px', color: '#1C231F', fontFamily: 'var(--heading-font)' }}>
        Basic Information
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <FormField
          label="Package Name"
          name="name"
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          required
        />

        <FormField
          label="Slug"
          name="slug"
          value={formData.slug}
          onChange={(e) => updateField('slug', e.target.value)}
          required
          placeholder="package-name-slug"
        />

        <FormField
          label="Category"
          name="category_id"
          type="select"
          value={formData.category_id}
          onChange={(e) => updateField('category_id', e.target.value)}
          options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
        />

        <FormField
          label="Status"
          name="status"
          type="select"
          value={formData.status}
          onChange={(e) => updateField('status', e.target.value)}
          options={[
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
        />

        <FormField
          label="Base Price"
          name="base_price"
          type="number"
          value={formData.base_price}
          onChange={(e) => updateField('base_price', e.target.value)}
          required
          step="0.01"
        />

        <FormField
          label="Discount Price (optional)"
          name="discount_price"
          type="number"
          value={formData.discount_price}
          onChange={(e) => updateField('discount_price', e.target.value)}
          step="0.01"
        />

        <FormField
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={(e) => updateField('currency', e.target.value)}
          required
        />

        <FormField
          label="Badge (optional)"
          name="badge"
          value={formData.badge}
          onChange={(e) => updateField('badge', e.target.value)}
          placeholder="Featured, Popular, 10% Off"
        />

        <FormField
          label="Rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={(e) => updateField('rating', e.target.value)}
          min="1"
          max="5"
        />

        <FormField
          label="Location"
          name="location"
          value={formData.location}
          onChange={(e) => updateField('location', e.target.value)}
        />

        <FormField
          label="Duration"
          name="duration"
          value={formData.duration}
          onChange={(e) => updateField('duration', e.target.value)}
          placeholder="3 days 2 nights"
        />

        <FormField
          label="Guests"
          name="guests"
          value={formData.guests}
          onChange={(e) => updateField('guests', e.target.value)}
          placeholder="5-8 guest"
        />

        <FormField
          label="Display Section"
          name="display_section"
          type="select"
          value={formData.display_section}
          onChange={(e) => updateField('display_section', e.target.value)}
          required
          options={SECTION_OPTIONS}
        />
      </div>
    </div>
  )
}

