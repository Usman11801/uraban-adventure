import GuideForm from '@/components/admin/guides/GuideForm'

export default function NewGuidePage() {
  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Create New Guide
      </h1>
      <GuideForm />
    </div>
  )
}

