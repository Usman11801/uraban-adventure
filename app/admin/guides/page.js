import { createServiceClient } from '@/lib/supabase/server'
import GuidesTable from '@/components/admin/guides/GuidesTable'
import Link from 'next/link'

export default async function GuidesPage() {
  const supabase = createServiceClient()
  
  const { data: guides, error } = await supabase
    .from('guides')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching guides:', error)
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1a202c', margin: 0, marginBottom: '4px' }}>
            Guides
          </h1>
          {guides && (
            <p style={{ color: '#718096', fontSize: '14px', margin: 0 }}>
              {guides.length} guide{guides.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        <Link
          href="/admin/guides/new"
          style={{
            background: '#667eea',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          ➕ Create Guide
        </Link>
      </div>

      {error && (
        <div style={{
          background: '#fed7d7',
          color: '#c53030',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #fc8181'
        }}>
          <strong>Error loading guides:</strong> {error.message}
        </div>
      )}

      {!error && guides && guides.length === 0 && (
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          border: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#718096', marginBottom: '16px' }}>
            No guides found. Create your first guide to get started!
          </p>
          <Link
            href="/admin/guides/new"
            style={{
              background: '#667eea',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              display: 'inline-block'
            }}
          >
            ➕ Create First Guide
          </Link>
        </div>
      )}

      {!error && guides && guides.length > 0 && (
        <GuidesTable guides={guides} />
      )}
    </div>
  )
}

