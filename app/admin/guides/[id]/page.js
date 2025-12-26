import { createServiceClient } from '@/lib/supabase/server'
import GuideForm from '@/components/admin/guides/GuideForm'
import { notFound } from 'next/navigation'

export default async function EditGuidePage({ params }) {
  const supabase = createServiceClient()
  const { id } = params

  const { data: guide, error } = await supabase
    .from('guides')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !guide) {
    notFound()
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Edit Guide
      </h1>
      <GuideForm guideData={guide} />
    </div>
  )
}

