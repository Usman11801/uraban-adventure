"use client"

import { AdminSidebarProvider } from '@/context/AdminSidebarContext'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAdminSidebar } from '@/context/AdminSidebarContext'
import { useState, useEffect } from 'react'

function AdminLayoutContent({ children }) {
  const { isOpen } = useAdminSidebar()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh',
      background: '#F9F9F7',
      position: 'relative',
    }}>
      <AdminSidebar />
      
      {/* Blur overlay when sidebar is open */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 998,
            display: isMobile ? 'block' : 'none',
            transition: 'opacity 0.3s ease',
          }}
          className="md:hidden"
        />
      )}

      <div style={{ 
        flex: 1, 
        width: '100%',
        marginLeft: !isMobile && isOpen ? '280px' : '0',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease, filter 0.3s ease',
        position: 'relative',
        filter: isOpen ? 'blur(4px)' : 'none',
      }}>
        <AdminHeader />
        <main style={{ 
          padding: '32px 40px',
          flex: 1,
          width: '100%',
          maxWidth: '100%',
          position: 'relative',
          zIndex: 1,
        }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function AdminLayoutWrapper({ children }) {
  return (
    <AdminSidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AdminSidebarProvider>
  )
}

