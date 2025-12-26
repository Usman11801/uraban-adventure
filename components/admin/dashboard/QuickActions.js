import Link from 'next/link'

const actions = [
  { title: 'Create Package', href: '/admin/packages/new', icon: '➕', gradient: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)' },
  { title: 'Add Category', href: '/admin/categories/new', icon: '🏷️', gradient: 'linear-gradient(135deg, #F7921E 0%, #e67e1a 100%)' },
  { title: 'Add Guide', href: '/admin/guides/new', icon: '👤', gradient: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)' },
  { title: 'View Reports', href: '/admin/reports', icon: '📈', gradient: 'linear-gradient(135deg, #F7921E 0%, #e67e1a 100%)' },
]

export default function QuickActions() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      border: '1px solid #E9E9E9',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        paddingBottom: '20px',
        borderBottom: '2px solid #E9E9E9',
      }}>
        <h2 style={{
          fontSize: '22px',
          fontWeight: '700',
          margin: 0,
          color: '#1C231F',
          fontFamily: 'var(--heading-font)',
        }}>
          Quick Actions
        </h2>
        <span style={{
          fontSize: '24px',
        }}>
          ⚡
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="admin-quick-action-link"
            data-gradient={action.gradient}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px 18px',
              background: 'white',
              borderRadius: '12px',
              border: '1px solid #E9E9E9',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <span style={{ 
              fontSize: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
            }}>
              {action.icon}
            </span>
            <span style={{
              fontWeight: '600',
              color: '#1C231F',
              fontSize: '15px',
              flex: 1,
            }}>
              {action.title}
            </span>
            <span style={{
              fontSize: '18px',
              opacity: 0.5,
            }}>
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

