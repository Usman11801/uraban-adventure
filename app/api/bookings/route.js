import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendBookingConfirmationEmail } from '@/lib/loops/email'

// POST - Create a new booking
export async function POST(request) {
  try {
    const body = await request.json()
    const {
      customer_name,
      customer_email,
      customer_phone,
      nationality,
      hotel_name,
      gender,
      payment_method,
      payment_status = 'pending',
      booking_status = 'pending', // Will be 'pending' until admin approves
      total_amount,
      cart_items,
    } = body

    // Validation
    if (!customer_name || !customer_email || !customer_phone || !total_amount || !cart_items || cart_items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = createServiceClient()

    // Create bookings for each cart item
    const bookings = []
    let clientSecret = null

    for (const item of cart_items) {
      // Parse travel date
      const travelDate = item.selectedDate ? new Date(item.selectedDate) : new Date()
      
      // Calculate adults and children
      const adults = item.adultCount || 0
      const children = item.childCount || 0

      // Prepare addons data
      const addonsData = item.selectedAddons ? Object.keys(item.selectedAddons)
        .filter(id => item.selectedAddons[id]?.selected)
        .map(id => ({
          id,
          name: item.selectedAddons[id].name,
          adult: item.selectedAddons[id].adult || 0,
          child: item.selectedAddons[id].child || 0,
          adultPrice: item.selectedAddons[id].adultPrice || 0,
          childPrice: item.selectedAddons[id].childPrice || 0,
        })) : []

      // Create booking
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          package_id: item.tourId,
          customer_name,
          customer_email,
          customer_phone,
          travel_date: travelDate.toISOString().split('T')[0],
          adults,
          children,
          total_amount: parseFloat(item.totalAmount || 0),
          payment_method,
          payment_status,
          booking_status,
          nationality: nationality || null,
          gender: gender || null,
          hotel_name: hotel_name || null,
          special_requests: `Nationality: ${nationality || 'N/A'}, Gender: ${gender || 'N/A'}, Hotel/Pickup: ${hotel_name || 'N/A'}`,
          addons: addonsData.length > 0 ? addonsData : null,
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json(
          { error: error.message || 'Failed to create booking' },
          { status: 500 }
        )
      }

      bookings.push(booking)
    }

    // Send confirmation email for "Pay on Arrival" bookings
    if (payment_method === 'pay_on_arrival' && bookings.length > 0) {
      try {
        // Send email for each booking
        for (let i = 0; i < bookings.length; i++) {
          const booking = bookings[i]
          const cartItem = cart_items[i] || cart_items[0] // Fallback to first item if index doesn't match
          
          // Get package details for this booking
          let packageName = cartItem?.tourTitle || 'Tour Package'
          if (booking.package_id) {
            const { data: packageData } = await supabase
              .from('packages')
              .select('name')
              .eq('id', booking.package_id)
              .single()
            
            if (packageData?.name) {
              packageName = packageData.name
            }
          }

          const emailResult = await sendBookingConfirmationEmail({
            customerEmail: customer_email,
            customerName: customer_name,
            bookingId: booking.booking_id || booking.id,
            packageName: packageName,
            travelDate: booking.travel_date,
            adults: booking.adults,
            children: booking.children,
            totalAmount: parseFloat(booking.total_amount),
            currency: 'AED',
            paymentMethod: payment_method,
            hotelName: hotel_name,
            nationality: nationality,
            addons: booking.addons || [],
          })

          if (!emailResult.success) {
            console.error(`Failed to send email for booking ${booking.id}:`, emailResult.error)
            // Don't fail the booking creation if email fails
          }
        }
      } catch (emailError) {
        console.error('Error sending booking confirmation emails:', emailError)
        // Don't fail the booking creation if email fails
      }
    }

    // If Stripe payment, create payment intent
    if (payment_method === 'stripe') {
      try {
        // TODO: Integrate Stripe payment intent creation
        // For now, return a placeholder
        clientSecret = 'stripe_client_secret_placeholder'
        
        // In production, you would:
        // 1. Import Stripe
        // 2. Create payment intent
        // 3. Return client secret
        // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
        // const paymentIntent = await stripe.paymentIntents.create({
        //   amount: Math.round(total_amount * 100), // Convert to cents
        //   currency: 'aed',
        //   metadata: { booking_ids: bookings.map(b => b.id).join(',') }
        // })
        // clientSecret = paymentIntent.client_secret
      } catch (stripeError) {
        console.error('Stripe error:', stripeError)
        // Continue even if Stripe fails - booking is still created
      }
    }

    return NextResponse.json({
      success: true,
      bookings,
      clientSecret,
      message: payment_method === 'pay_on_arrival' 
        ? 'Booking confirmed! You will pay on arrival.'
        : 'Booking created. Please proceed with payment.',
    }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
