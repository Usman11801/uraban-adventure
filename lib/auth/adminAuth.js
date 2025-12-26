import { createClient } from '@/lib/supabase/server'

export async function getAdminUser() {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { user: null, isAdmin: false, error: authError }
  }

  // Check if user has admin role
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { user: null, isAdmin: false, error: profileError }
  }

  const isAdmin = profile.role === 'admin'

  return { user, isAdmin, error: null }
}

export async function requireAdmin() {
  const { user, isAdmin, error } = await getAdminUser()
  
  if (error || !user || !isAdmin) {
    return { 
      user: null, 
      isAdmin: false, 
      error: error || new Error('Unauthorized') 
    }
  }

  return { user, isAdmin: true, error: null }
}

