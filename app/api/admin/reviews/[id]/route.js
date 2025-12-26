import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { NextResponse } from 'next/server'

// PUT - Update review
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
    const allowedFields = [
      'name', 'rating', 'comment', 'services_rating',
      'guides_rating', 'price_rating', 'date', 'is_approved'
    ]

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (['rating', 'services_rating', 'guides_rating', 'price_rating'].includes(field)) {
          updateData[field] = body[field] ? parseInt(body[field]) : null
        } else {
          updateData[field] = body[field]
        }
      }
    })

    const { data, error } = await supabase
      .from('reviews')
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

    return NextResponse.json({ review: data })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE - Delete review
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
      .from('reviews')
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

