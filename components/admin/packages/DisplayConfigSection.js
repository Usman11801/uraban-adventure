import FormField from '@/components/admin/ui/FormField'

const PAGE_OPTIONS = [
  { value: 'sight-see-list', label: 'Sight See List' },
  { value: 'tour-list', label: 'Tour List' },
  { value: 'desert-resort-list', label: 'Desert Resort List' },
  { value: 'theme-park-list', label: 'Theme Park List' },
  { value: 'buggy-bike-list', label: 'Buggy & Bike List' },
  { value: 'private-tour-list', label: 'Private Tour List' },
  { value: 'executive-tour-list', label: 'Executive Tour List' },
  { value: 'combo-deal-list', label: 'Combo Deal List' },
  { value: 'water-park-list', label: 'Water Park List' },
  { value: 'sky-tour-list', label: 'Sky Tour List' },
  { value: 'sea-advantucher-list', label: 'Sea Adventure List' },
  { value: 'dhow-cruise-list', label: 'Dhow Cruise List' },
]

const SECTION_OPTIONS = [
  { value: 'main', label: 'Main Section' },
  { value: 'featured', label: 'Featured Section' },
  { value: 'popular', label: 'Popular Section' },
  { value: 'sidebar', label: 'Sidebar' },
]

export default function DisplayConfigSection({ formData, updateField }) {
  return (
    <div>
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Display Configuration
      </h2>
      <p style={{ color: '#718096', marginBottom: '24px', fontSize: '14px' }}>
        Configure where this package appears on the website
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <FormField
          label="Display Page"
          name="display_page"
          type="select"
          value={formData.display_page}
          onChange={(e) => updateField('display_page', e.target.value)}
          required
          options={PAGE_OPTIONS}
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

