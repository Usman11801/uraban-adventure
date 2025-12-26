import { createServiceClient } from '@/lib/supabase/server'
import PackageForm from '@/components/admin/packages/PackageForm'
import { Suspense } from 'react'

export default async function NewPackagePage() {
  const supabase = createServiceClient()
  
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_active', true)
    .order('name')

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Create New Package
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PackageForm categories={categories || []} />
      </Suspense>
    </div>
  )
}

