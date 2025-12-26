import { createServiceClient } from '@/lib/supabase/server'
import PackageForm from '@/components/admin/packages/PackageForm'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function EditPackagePage({ params }) {
  const supabase = createServiceClient()
  
  const { id } = params

  const [packageResult, categoriesResult] = await Promise.all([
    supabase
      .from('packages')
      .select(`
        *,
        category:categories(id, name, slug),
        addons:package_addons(*),
        reviews:reviews(*)
      `)
      .eq('id', id)
      .single(),
    supabase
      .from('categories')
      .select('id, name, slug')
      .eq('is_active', true)
      .order('name'),
  ])

  if (packageResult.error || !packageResult.data) {
    notFound()
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Edit Package
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        <PackageForm
          packageData={packageResult.data}
          categories={categoriesResult.data || []}
        />
      </Suspense>
    </div>
  )
}

