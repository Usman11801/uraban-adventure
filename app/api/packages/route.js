import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Get active packages filtered by page/section
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const section = searchParams.get('section')
    const categoryId = searchParams.get('category_id')
    const limit = searchParams.get('limit')

    const supabase = await createClient()
    let query = supabase
      .from('packages')
      .select(`
        *,
        category:categories(id, name, slug),
        addons:package_addons(*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (page) {
      query = query.eq('display_page', page)
    }

    if (section) {
      query = query.eq('display_section', section)
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    if (limit) {
      query = query.limit(parseInt(limit))
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Filter addons to only active ones
    const packages = data?.map(pkg => ({
      ...pkg,
      addons: pkg.addons?.filter(addon => addon.is_active) || [],
    })) || []

    return NextResponse.json({ packages })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

