"use client"

export default function DataTable({ columns, data, onRowClick, actions }) {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
      borderRadius: '16px',
      overflow: 'hidden',
      border: '1px solid #E9E9E9',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ 
            background: 'linear-gradient(135deg, rgba(99,171,69,0.1) 0%, rgba(247,146,30,0.05) 100%)',
            borderBottom: '2px solid #E9E9E9' 
          }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: '16px 20px',
                  textAlign: 'left',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: '#1C231F',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: 'var(--heading-font)',
                }}
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th style={{
                padding: '16px 20px',
                textAlign: 'right',
                fontSize: '13px',
                fontWeight: '700',
                color: '#1C231F',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: 'var(--heading-font)',
              }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                style={{
                  padding: '40px',
                  textAlign: 'center',
                  color: '#718096'
                }}
              >
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row.id || index}
                onClick={() => onRowClick && onRowClick(row)}
                style={{
                  borderBottom: '1px solid #E9E9E9',
                  cursor: onRowClick ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  background: index % 2 === 0 ? 'transparent' : 'rgba(99,171,69,0.02)',
                }}
                onMouseEnter={(e) => {
                  if (onRowClick) {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(99,171,69,0.08) 0%, rgba(247,146,30,0.05) 100%)'
                    e.currentTarget.style.transform = 'scale(1.01)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = index % 2 === 0 ? 'transparent' : 'rgba(99,171,69,0.02)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '16px 20px',
                      fontSize: '14px',
                      color: '#1C231F',
                      fontWeight: '500',
                    }}
                  >
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

