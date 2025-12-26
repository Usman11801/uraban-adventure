// Stripe client setup for future use
// Install: npm install stripe

// import Stripe from 'stripe'

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
//   apiVersion: '2024-11-20.acacia',
// })

// For now, return null until Stripe is configured
export const stripe = null

export function createStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  
  // Uncomment when ready to use Stripe:
  // const Stripe = require('stripe')
  // return new Stripe(process.env.STRIPE_SECRET_KEY, {
  //   apiVersion: '2024-11-20.acacia',
  // })
  
  return null
}

