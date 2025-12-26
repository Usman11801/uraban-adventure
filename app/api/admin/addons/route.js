import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// GET - Get all addons across all packages (for selecting when creating new package)
export async function GET(request) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from('package_addons')
      .select(`
        *,
        package:packages(id, name, slug)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ addons: data || [] })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST - Create a new addon (will be linked to a package later)
export async function POST(request) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      package_id,
      name,
      description,
      image,
      price,
      adult_price,
      child_price,
      is_active = true,
    } = body

    if (!name || (!adult_price && !price)) {
      return NextResponse.json(
        { error: 'Name and price (or adult_price) are required' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Use adult_price/child_price if provided, otherwise use price for both
    const finalAdultPrice = adult_price || price || 0
    const finalChildPrice = child_price || price || 0

    const { data, error } = await supabase
      .from('package_addons')
      .insert({
        package_id: package_id || null, // Can be null if creating before package exists
        name,
        description,
        image,
        price: finalAdultPrice, // Keep for backward compatibility
        adult_price: parseFloat(finalAdultPrice),
        child_price: parseFloat(finalChildPrice),
        is_active,
      })
      .select(`
        *,
        package:packages(id, name, slug)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ addon: data }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

