import FormField from '@/components/admin/ui/FormField'

export default function GallerySection({ formData, updateField }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Gallery Images
      </h2>
      <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>
        Enter image URLs. For now, use existing image paths or upload to a CDN and paste URLs here.
      </p>

      <FormField
        label="Main Image (Required)"
        name="image"
        value={formData.image}
        onChange={(e) => updateField('image', e.target.value)}
        required
        placeholder="assets/images/destinations/image.jpg or full URL"
      />

      {formData.image && (
        <div style={{ marginBottom: '20px' }}>
          <img
            src={formData.image}
            alt="Main preview"
            style={{
              maxWidth: '300px',
              maxHeight: '200px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
            }}
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <FormField
          label="Image 1"
          name="image1"
          value={formData.image1}
          onChange={(e) => updateField('image1', e.target.value)}
          placeholder="Gallery image 1"
        />

        <FormField
          label="Image 2"
          name="image2"
          value={formData.image2}
          onChange={(e) => updateField('image2', e.target.value)}
          placeholder="Gallery image 2"
        />

        <FormField
          label="Image 3"
          name="image3"
          value={formData.image3}
          onChange={(e) => updateField('image3', e.target.value)}
          placeholder="Gallery image 3"
        />

        <FormField
          label="Image 4"
          name="image4"
          value={formData.image4}
          onChange={(e) => updateField('image4', e.target.value)}
          placeholder="Gallery image 4"
        />

        <FormField
          label="Image 5"
          name="image5"
          value={formData.image5}
          onChange={(e) => updateField('image5', e.target.value)}
          placeholder="Gallery image 5"
        />
      </div>
    </div>
  )
}

