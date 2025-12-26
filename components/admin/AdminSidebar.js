"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAdminSidebar } from '@/context/AdminSidebarContext'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: '📊',
  },
  {
    title: 'Packages',
    href: '/admin/packages',
    icon: '📦',
  },
  {
    title: 'Categories',
    href: '/admin/categories',
    icon: '🏷️',
  },
  {
    title: 'Bookings',
    href: '/admin/bookings',
    icon: '📋',
  },
  {
    title: 'Guides',
    href: '/admin/guides',
    icon: '👤',
  },
  {
    title: 'Reports',
    href: '/admin/reports',
    icon: '📈',
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { isOpen, setIsOpen } = useAdminSidebar()

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) {
        setIsOpen(true) // Open sidebar on desktop by default
      }
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsOpen])

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          zIndex: 1001,
          background: 'linear-gradient(135deg, #63AB45 0%, #F7921E 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          padding: '12px 14px',
          cursor: 'pointer',
          display: isMobile ? 'block' : 'none',
          boxShadow: '0 4px 15px rgba(99,171,69,0.4)',
          fontSize: '20px',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 6px 20px rgba(99,171,69,0.5)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 4px 15px rgba(99,171,69,0.4)';
        }}
      >
        ☰
      </button>

      {/* Desktop toggle button */}
      {!isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'fixed',
            top: '20px',
            left: isOpen ? '300px' : '20px',
            zIndex: 1001,
            background: 'linear-gradient(135deg, #63AB45 0%, #F7921E 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 14px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(99,171,69,0.4)',
            fontSize: '20px',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 6px 20px rgba(99,171,69,0.5)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 15px rgba(99,171,69,0.4)';
          }}
        >
          {isOpen ? '←' : '☰'}
        </button>
      )}

      {/* Mobile overlay */}
      {isMobileOpen && isMobile && (
        <div
          onClick={() => setIsMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 999,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          width: '280px',
          background: 'linear-gradient(180deg, #1C231F 0%, #2a342f 100%)',
          color: 'white',
          minHeight: '100vh',
          position: 'fixed',
          left: isMobile 
            ? (isMobileOpen ? 0 : '-280px')
            : (isOpen ? 0 : '-280px'),
          top: 0,
          transition: 'left 0.3s ease',
          zIndex: 1000,
          padding: '0',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        }}
      >
        {/* Logo/Brand Section */}
        <div style={{ 
          padding: '30px 24px', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          background: 'linear-gradient(135deg, rgba(99,171,69,0.2) 0%, rgba(247,146,30,0.1) 100%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #63AB45 0%, #F7921E 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(99,171,69,0.3)',
            }}>
              🎯
            </div>
            <div>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '700', 
                margin: 0,
                background: 'linear-gradient(135deg, #63AB45 0%, #F7921E 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Admin Panel
              </h2>
              <p style={{ 
                fontSize: '12px', 
                color: 'rgba(255,255,255,0.6)', 
                margin: '2px 0 0 0' 
              }}>
                Travel Management
              </p>
            </div>
          </div>
        </div>

        <nav style={{ padding: '20px 0' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <div
                key={item.href}
                className={!isActive ? 'admin-nav-item-hover' : ''}
                style={{
                  margin: '0 12px 8px 12px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '14px 18px',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
                    background: isActive 
                      ? 'linear-gradient(135deg, #63AB45 0%, #4a8a35 100%)' 
                      : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: isActive ? '600' : '500',
                    boxShadow: isActive ? '0 4px 15px rgba(99,171,69,0.3)' : 'none',
                    transform: isActive ? 'translateX(4px)' : 'translateX(0)',
                  }}
                >
                  <span style={{ 
                    marginRight: '14px', 
                    fontSize: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '15px' }}>
                    {item.title}
                  </span>
                  {isActive && (
                    <span style={{ 
                      marginLeft: 'auto',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#fff',
                      boxShadow: '0 0 8px rgba(255,255,255,0.8)',
                    }} />
                  )}
                </Link>
              </div>
            )
          })}
        </nav>

        {/* Footer Section */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '20px 24px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(0,0,0,0.2)',
        }}>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255,255,255,0.5)',
            margin: 0,
            textAlign: 'center',
          }}>
            © 2024 Urban Adventure
          </p>
        </div>
      </aside>
    </>
  )
}

