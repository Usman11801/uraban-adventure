import { requireAdmin } from '@/lib/auth/adminAuth'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import AdminLayoutWrapper from '@/components/admin/AdminLayoutWrapper'

export default async function AdminLayout({ children }) {
  // Get current pathname to check if we're on login page
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Skip auth check for login page - let the child layout handle it
  if (pathname === '/admin/login') {
    return <>{children}</>
  }
  
  const { user, isAdmin, error } = await requireAdmin()

  if (error || !isAdmin) {
    redirect('/admin/login')
  }

  return <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
}

