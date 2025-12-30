import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sendBookingConfirmationEmail } from '@/lib/loops/email'
import { createStripeClient } from '@/lib/stripe/client'

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
    let checkoutUrl = null

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

    // If Stripe payment, create invoice and checkout session
    if (payment_method === 'stripe') {
      try {
        const stripe = createStripeClient()
        const bookingIds = bookings.map(b => b.id).join(',')

        // Step 1: Create or retrieve Stripe Customer
        let customer
        const existingCustomers = await stripe.customers.list({
          email: customer_email,
          limit: 1,
        })

        if (existingCustomers.data.length > 0) {
          customer = existingCustomers.data[0]
        } else {
          customer = await stripe.customers.create({
            email: customer_email,
            name: customer_name,
            phone: customer_phone,
            metadata: {
              bookingIds: bookingIds,
            },
          })
        }

        // Step 2: Create Invoice as draft first
        const invoice = await stripe.invoices.create({
          customer: customer.id,
          auto_advance: false, // Don't auto-finalize, we'll finalize after adding items
          collection_method: 'charge_automatically',
          metadata: {
            bookingIds: bookingIds,
            customerName: customer_name,
            customerEmail: customer_email,
          },
        })

        console.log('Created draft invoice:', invoice.id, 'Status:', invoice.status)

        // Step 3: Add line items to the Invoice and calculate subtotal
        let subtotal = 0
        for (const item of cart_items) {
          const itemTotal = parseFloat(item.totalAmount || 0)
          const addonsTotal = item.selectedAddons ? Object.keys(item.selectedAddons).reduce((sum, addonId) => {
            const addon = item.selectedAddons[addonId]
            if (addon && addon.selected) {
              return sum + ((addon.adult || 0) * (addon.adultPrice || 0)) + ((addon.child || 0) * (addon.childPrice || 0))
            }
            return sum
          }, 0) : 0

          const lineItemTotal = itemTotal + addonsTotal
          subtotal += lineItemTotal

          if (lineItemTotal > 0) {
            await stripe.invoiceItems.create({
              customer: customer.id,
              invoice: invoice.id,
              amount: Math.round(lineItemTotal * 100), // Convert to smallest currency unit
              currency: 'aed',
              description: `${item.tourTitle || 'Tour Package'} - Travel Date: ${item.selectedDate || 'TBD'}, Adults: ${item.adultCount || 0}, Children: ${item.childCount || 0}`,
              metadata: {
                bookingId: item.tourId?.toString() || '',
                tourTitle: item.tourTitle || '',
              },
            })
          }
        }

        // If no cart items, create a single invoice item from total amount
        if (cart_items.length === 0) {
          subtotal = parseFloat(total_amount || 0)
          await stripe.invoiceItems.create({
            customer: customer.id,
            invoice: invoice.id,
            amount: Math.round(subtotal * 100),
            currency: 'aed',
            description: `Booking Payment for ${customer_name}`,
            metadata: {
              bookingIds: bookingIds,
            },
          })
        }

        // Step 3.5: Add 5% VAT as a separate invoice item
        if (subtotal > 0) {
          const vatAmount = subtotal * 0.05 // 5% VAT
          await stripe.invoiceItems.create({
            customer: customer.id,
            invoice: invoice.id,
            amount: Math.round(vatAmount * 100), // Convert to smallest currency unit
            currency: 'aed',
            description: 'VAT (5%)',
            metadata: {
              type: 'vat',
              rate: '5',
            },
          })
          console.log('Added VAT (5%):', vatAmount, 'on subtotal:', subtotal)
        }

        // Step 4: Retrieve the invoice to ensure all items are added
        const updatedInvoice = await stripe.invoices.retrieve(invoice.id)
        console.log('Invoice after adding items:', updatedInvoice.id, 'Status:', updatedInvoice.status, 'Subtotal:', subtotal, 'Total:', updatedInvoice.total)

        // Step 5: Finalize the Invoice to make it "open" and visible in dashboard
        const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id, {
          auto_advance: false, // Don't auto-advance, we want it to stay "open" until paid
        })

        console.log('Finalized invoice:', finalizedInvoice.id, 'Status:', finalizedInvoice.status, 'Hosted URL:', finalizedInvoice.hosted_invoice_url)

        // Verify the invoice is in "open" status
        if (finalizedInvoice.status !== 'open' && finalizedInvoice.status !== 'paid') {
          console.warn('Invoice status is not "open" after finalization:', finalizedInvoice.status)
        }

        // Step 6: Use Invoice's hosted payment page URL
        // The invoice should now be visible in Stripe Dashboard > Invoices
        if (!finalizedInvoice.hosted_invoice_url) {
          throw new Error('Invoice finalized but no hosted_invoice_url available. Invoice ID: ' + finalizedInvoice.id)
        }

        checkoutUrl = finalizedInvoice.hosted_invoice_url
        console.log('Checkout URL created successfully:', checkoutUrl)
      } catch (stripeError) {
        console.error('Stripe error:', stripeError)
        // Continue even if Stripe fails - booking is still created
        return NextResponse.json(
          { error: `Booking created but failed to create payment session: ${stripeError.message}` },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({
      success: true,
      bookings,
      checkoutUrl,
      invoiceId: payment_method === 'stripe' ? checkoutUrl?.includes('invoice') ? 'Created' : null : null,
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
