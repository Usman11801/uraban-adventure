import Stripe from 'stripe'

export function createStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY && !process.env.NEXT_SECRETE_KEY) {
    throw new Error('STRIPE_SECRET_KEY or NEXT_SECRETE_KEY is not configured')
  }
  
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_SECRETE_KEY
  
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  })
}

// Export a default instance
export const stripe = process.env.STRIPE_SECRET_KEY || process.env.NEXT_SECRETE_KEY 
  ? createStripeClient()
  : null

