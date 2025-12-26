import { createServiceClient } from '@/lib/supabase/server'
import CategoryForm from '@/components/admin/categories/CategoryForm'
import { notFound } from 'next/navigation'

export default async function EditCategoryPage({ params }) {
  const supabase = createServiceClient()
  const { id } = params

  const { data: category, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !category) {
    notFound()
  }

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Edit Category
      </h1>
      <CategoryForm categoryData={category} />
    </div>
  )
}

