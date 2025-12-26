export default function StatusBadge({ status, type = 'status' }) {
  const statusConfig = {
    status: {
      active: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)', 
        text: 'Active',
        shadow: '0 2px 8px rgba(99,171,69,0.3)',
      },
      inactive: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
        text: 'Inactive',
        shadow: '0 2px 8px rgba(239,68,68,0.3)',
      },
    },
    payment: {
      pending: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #F7921E 0%, #e67e1a 100%)', 
        text: 'Pending',
        shadow: '0 2px 8px rgba(247,146,30,0.3)',
      },
      paid: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)', 
        text: 'Paid',
        shadow: '0 2px 8px rgba(99,171,69,0.3)',
      },
      failed: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
        text: 'Failed',
        shadow: '0 2px 8px rgba(239,68,68,0.3)',
      },
      refunded: { 
        color: '#484848', 
        bg: '#E9E9E9', 
        text: 'Refunded',
        shadow: 'none',
      },
    },
    booking: {
      pending: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #F7921E 0%, #e67e1a 100%)', 
        text: 'Pending',
        shadow: '0 2px 8px rgba(247,146,30,0.3)',
      },
      confirmed: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)', 
        text: 'Confirmed',
        shadow: '0 2px 8px rgba(99,171,69,0.3)',
      },
      cancelled: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
        text: 'Cancelled',
        shadow: '0 2px 8px rgba(239,68,68,0.3)',
      },
      completed: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
        text: 'Completed',
        shadow: '0 2px 8px rgba(59,130,246,0.3)',
      },
    },
    availability: {
      available: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)', 
        text: 'Available',
        shadow: '0 2px 8px rgba(99,171,69,0.3)',
      },
      busy: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #F7921E 0%, #e67e1a 100%)', 
        text: 'Busy',
        shadow: '0 2px 8px rgba(247,146,30,0.3)',
      },
      unavailable: { 
        color: '#fff', 
        bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', 
        text: 'Unavailable',
        shadow: '0 2px 8px rgba(239,68,68,0.3)',
      },
    },
  }

  const config = statusConfig[type]?.[status] || {
    color: '#484848',
    bg: '#E9E9E9',
    text: status,
    shadow: 'none',
  }

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        color: config.color,
        background: config.bg,
        boxShadow: config.shadow,
        letterSpacing: '0.3px',
      }}
    >
      {config.text}
    </span>
  )
}

