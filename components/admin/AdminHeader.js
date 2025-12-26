"use client"

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

export default function AdminHeader() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #F9F9F7 100%)',
        borderBottom: '2px solid #E9E9E9',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link
          href="/"
          target="_blank"
          style={{
            color: '#63AB45',
            textDecoration: 'none',
            fontSize: '15px',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(99,171,69,0.1) 0%, rgba(247,146,30,0.1) 100%)',
            border: '1px solid rgba(99,171,69,0.2)',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'linear-gradient(135deg, #63AB45 0%, #F7921E 100%)';
            e.target.style.color = '#fff';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 15px rgba(99,171,69,0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'linear-gradient(135deg, rgba(99,171,69,0.1) 0%, rgba(247,146,30,0.1) 100%)';
            e.target.style.color = '#63AB45';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <span>🌐</span>
          View Website
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {!loading && user && (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 18px',
              background: 'rgba(99,171,69,0.05)',
              borderRadius: '12px',
              border: '1px solid rgba(99,171,69,0.1)',
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #63AB45 0%, #F7921E 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontWeight: 'bold',
                fontSize: '14px',
              }}>
                {user.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span style={{ 
                color: '#1C231F', 
                fontSize: '14px',
                fontWeight: '500',
              }}>
                {user.email}
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255,107,107,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255,107,107,0.3)';
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  )
}

