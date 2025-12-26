import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - Get single package by id
export async function GET(request, { params }) {
  try {
    const { id } = params
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('packages')
      .select(`
        *,
        category:categories(id, name, slug),
        addons:package_addons(*),
        reviews:reviews(*)
      `)
      .eq('id', id)
      .eq('status', 'active')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      )
    }

    // Filter to only active addons and approved reviews
    const packageData = {
      ...data,
      addons: data.addons?.filter(addon => addon.is_active) || [],
      reviews: data.reviews?.filter(review => review.is_approved) || [],
    }

    return NextResponse.json({ package: packageData })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

