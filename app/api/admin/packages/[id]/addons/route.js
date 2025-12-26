import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// GET - Get all addons for a package
export async function GET(request, { params }) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = params
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('package_addons')
      .select('*')
      .eq('package_id', id)
      .order('created_at', { ascending: true })

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

// POST - Create addon for package
export async function POST(request, { params }) {
  try {
    const { isAdmin } = await requireAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { id } = params
    const body = await request.json()
    const { 
      name, 
      description, 
      image,
      price, 
      adult_price, 
      child_price, 
      is_active = true 
    } = body

    // Validate required fields
    if (!name || (!adult_price && !price)) {
      return NextResponse.json(
        { error: 'Name and price (or adult_price) are required' },
        { status: 400 }
      )
    }

    // Use adult_price/child_price if provided, otherwise use price for both
    const finalAdultPrice = adult_price ? parseFloat(adult_price) : (price ? parseFloat(price) : 0)
    const finalChildPrice = child_price ? parseFloat(child_price) : (price ? parseFloat(price) : 0)

    const supabase = createServiceClient()

    // Ensure package_id is set to the route parameter (cannot be overridden)
    const { data, error } = await supabase
      .from('package_addons')
      .insert({
        package_id: id, // Always use the package ID from the route
        name,
        description,
        image: image || null,
        price: finalAdultPrice, // Keep for backward compatibility
        adult_price: finalAdultPrice,
        child_price: finalChildPrice,
        is_active,
      })
      .select()
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

