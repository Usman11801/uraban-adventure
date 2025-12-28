import { createServiceClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/adminAuth'
import { sendPackageApprovalEmail } from '@/lib/loops/email'
import { NextResponse } from 'next/server'

// POST - Approve booking
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
    const supabase = createServiceClient()

    const { data, error } = await supabase
      .from('bookings')
      .update({
        booking_status: 'confirmed',
        // Payment status remains unchanged - admin must confirm payment separately
      })
      .eq('id', id)
      .select(`
        *,
        package:packages(*, category:categories(*)),
        guide:guides(*)
      `)
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    // Send package approval email to customer
    if (data && data.customer_email) {
      try {
        // Validate email before sending
        if (!data.customer_email || !data.customer_email.trim() || !data.customer_email.includes('@')) {
          console.error(`Invalid customer email for booking ${data.id}:`, data.customer_email)
        } else {
          // Format addons data
          const addons = Array.isArray(data.addons) ? data.addons : []
          
          console.log(`Attempting to send approval email for booking ${data.id} to ${data.customer_email}`)
          
          const emailResult = await sendPackageApprovalEmail({
            customerEmail: data.customer_email,
            customerName: data.customer_name,
            bookingId: data.booking_id || data.id,
            packageName: data.package?.name || 'Tour Package',
            travelDate: data.travel_date,
            adults: data.adults || 0,
            children: data.children || 0,
            totalAmount: parseFloat(data.total_amount || 0),
            currency: 'AED',
            paymentMethod: data.payment_method,
            hotelName: data.hotel_name,
            nationality: data.nationality,
            addons: addons,
          })

          if (!emailResult.success) {
            console.error(`Failed to send approval email for booking ${data.id}:`, emailResult.error)
            // Don't fail the approval if email fails - just log the error
          } else {
            console.log(`Package approval email sent successfully to ${data.customer_email} for booking ${data.id}`)
          }
        }
      } catch (emailError) {
        console.error('Error sending package approval email:', emailError)
        console.error('Error details:', {
          message: emailError.message,
          stack: emailError.stack,
          json: emailError.json
        })
        // Don't fail the approval if email fails - just log the error
      }
    } else {
      console.warn(`Cannot send approval email for booking ${data?.id}: customer_email is missing or invalid`)
    }

    return NextResponse.json({ booking: data, message: 'Booking approved successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

