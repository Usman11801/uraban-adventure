import { createServiceClient } from '@/lib/supabase/server'
import DataTable from '@/components/admin/ui/DataTable'
import StatusBadge from '@/components/admin/ui/StatusBadge'
import Link from 'next/link'
import CategoriesTable from '@/components/admin/categories/CategoriesTable'

export default async function CategoriesPage() {
  const supabase = createServiceClient()
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            color: '#1C231F', 
            margin: 0, 
            marginBottom: '8px',
            fontFamily: 'var(--heading-font)',
          }}>
            Categories
          </h1>
          {categories && (
            <p style={{ 
              color: '#484848', 
              fontSize: '15px', 
              margin: 0,
              fontWeight: '500',
            }}>
              {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} found
            </p>
          )}
        </div>
        <Link
          href="/admin/categories/new"
          className="admin-primary-button"
          style={{
            background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
            color: 'white',
            padding: '14px 28px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 4px 15px rgba(99,171,69,0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          ➕ Create Category
        </Link>
      </div>

      {error && (
        <div style={{
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
          color: '#dc2626',
          padding: '20px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          border: '2px solid #fca5a5',
          boxShadow: '0 4px 15px rgba(220,38,38,0.1)',
        }}>
          <strong style={{ fontSize: '15px', fontWeight: '700' }}>Error loading categories:</strong> {error.message}
        </div>
      )}

      {!error && categories && categories.length === 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
          padding: '60px 40px',
          borderRadius: '16px',
          textAlign: 'center',
          border: '1px solid #E9E9E9',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏷️</div>
          <p style={{ 
            color: '#1C231F', 
            marginBottom: '12px',
            fontSize: '18px',
            fontWeight: '600',
          }}>
            No categories found
          </p>
          <p style={{ 
            color: '#484848', 
            marginBottom: '24px',
            fontSize: '15px',
          }}>
            Create your first category to get started!
          </p>
          <Link
            href="/admin/categories/new"
            className="admin-primary-button"
            style={{
              background: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: '600',
              display: 'inline-block',
              boxShadow: '0 4px 15px rgba(99,171,69,0.3)',
              transition: 'all 0.3s ease',
            }}
          >
            ➕ Create First Category
          </Link>
        </div>
      )}

      {!error && categories && categories.length > 0 && (
        <CategoriesTable categories={categories} />
      )}
    </div>
  )
}

