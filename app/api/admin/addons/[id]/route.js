import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// PUT - Update addon
export async function PUT(request, { params }) {
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
    const supabase = createServiceClient()

    const updateData = {}
    const allowedFields = ['name', 'description', 'image', 'price', 'adult_price', 'child_price', 'is_active', 'package_id']

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'price' || field === 'adult_price' || field === 'child_price') {
          updateData[field] = parseFloat(body[field])
        } else {
          updateData[field] = body[field]
        }
      }
    })

    const { data, error } = await supabase
      .from('package_addons')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ addon: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE - Delete addon
export async function DELETE(request, { params }) {
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

    const { error } = await supabase
      .from('package_addons')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

