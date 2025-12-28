import { NextResponse } from 'next/server'
import { createStripeClient } from '@/lib/stripe/client'

// POST - Create Stripe Checkout Session
export async function POST(request) {
  try {
    const stripe = createStripeClient()
    const body = await request.json()
    
    const {
      bookingId,
      customerName,
      customerEmail,
      amount,
      currency = 'aed',
      cartItems = [],
      successUrl,
      cancelUrl,
    } = body

    if (!customerEmail || !amount || !bookingId) {
      return NextResponse.json(
        { error: 'Missing required fields: customerEmail, amount, bookingId' },
        { status: 400 }
      )
    }

    // Build line items from cart items
    const lineItems = cartItems.map(item => {
      const itemTotal = parseFloat(item.totalAmount || 0)
      const addonsTotal = item.selectedAddons ? Object.keys(item.selectedAddons).reduce((sum, addonId) => {
        const addon = item.selectedAddons[addonId]
        if (addon && addon.selected) {
          return sum + ((addon.adult || 0) * (addon.adultPrice || 0)) + ((addon.child || 0) * (addon.childPrice || 0))
        }
        return sum
      }, 0) : 0
      
      return {
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: item.tourTitle || 'Tour Package',
            description: `Travel Date: ${item.selectedDate || 'TBD'}, Adults: ${item.adultCount || 0}, Children: ${item.childCount || 0}`,
          },
          unit_amount: Math.round((itemTotal + addonsTotal) * 100), // Convert to smallest currency unit
        },
        quantity: 1,
      }
    })

    // If no cart items, create a single line item from total amount
    if (lineItems.length === 0) {
      lineItems.push({
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: 'Booking Payment',
            description: `Booking ID: ${bookingId}`,
          },
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/cart?canceled=true`,
      metadata: {
        bookingId: bookingId.toString(),
        customerName,
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    })
  } catch (error) {
    console.error('Stripe checkout session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

