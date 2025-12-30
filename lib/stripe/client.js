import Stripe from 'stripe'

export function createStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY || process.env.NEXT_SECRETE_KEY
  
  if (!secretKey) {
    const env = process.env.NODE_ENV || 'development'
    const missingVar = !process.env.STRIPE_SECRET_KEY && !process.env.NEXT_SECRETE_KEY 
      ? 'Both STRIPE_SECRET_KEY and NEXT_SECRETE_KEY' 
      : !process.env.STRIPE_SECRET_KEY ? 'STRIPE_SECRET_KEY' : 'NEXT_SECRETE_KEY'
    
    throw new Error(
      `${missingVar} is not configured. ` +
      `Please add it to your environment variables. ` +
      `Current environment: ${env}. ` +
      `If using Vercel, ensure the variable is available for Production environment.`
    )
  }
  
  return new Stripe(secretKey, {
    apiVersion: '2024-11-20.acacia',
  })
}

// Export a default instance
export const stripe = process.env.STRIPE_SECRET_KEY || process.env.NEXT_SECRETE_KEY 
  ? createStripeClient()
  : null

