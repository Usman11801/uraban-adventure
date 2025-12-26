export default function StatsCard({ title, value, subtitle, icon, color }) {
  // Map colors to theme colors
  const colorMap = {
    '#667eea': { primary: '#63AB45', secondary: '#4a8a35', gradient: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)' },
    '#48bb78': { primary: '#63AB45', secondary: '#4a8a35', gradient: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)' },
    '#ed8936': { primary: '#F7921E', secondary: '#e67e1a', gradient: 'linear-gradient(135deg, #F7921E 0%, #e67e1a 100%)' },
    '#38b2ac': { primary: '#63AB45', secondary: '#4a8a35', gradient: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)' },
  }
  
  const themeColor = colorMap[color] || { 
    primary: '#63AB45', 
    secondary: '#4a8a35', 
    gradient: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)' 
  }

  return (
    <div 
      className="admin-stats-card"
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid #E9E9E9',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
    >
      {/* Decorative gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '120px',
        height: '120px',
        background: themeColor.gradient,
        opacity: 0.05,
        borderRadius: '50%',
        transform: 'translate(30px, -30px)',
      }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{ flex: 1 }}>
          <p style={{
            color: '#484848',
            fontSize: '13px',
            margin: '0 0 10px 0',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {title}
          </p>
          <h3 style={{
            color: '#1C231F',
            fontSize: '36px',
            fontWeight: '700',
            margin: '0 0 6px 0',
            lineHeight: '1.2',
            fontFamily: 'var(--heading-font)',
          }}>
            {value}
          </h3>
          {subtitle && (
            <p style={{
              color: '#484848',
              fontSize: '13px',
              margin: 0,
              fontWeight: '500',
            }}>
              {subtitle}
            </p>
          )}
        </div>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          background: themeColor.gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          boxShadow: `0 4px 15px ${themeColor.primary}40`,
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

