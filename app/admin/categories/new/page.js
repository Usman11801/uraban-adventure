import CategoryForm from '@/components/admin/categories/CategoryForm'

export default function NewCategoryPage() {
  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '24px', color: '#1a202c' }}>
        Create New Category
      </h1>
      <CategoryForm />
    </div>
  )
}

