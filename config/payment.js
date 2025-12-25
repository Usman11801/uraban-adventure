// Payment Configuration
// Copy this to .env.local and update with your actual values

export const paymentConfig = {
  // Ziina Payment Gateway Configuration
  ZIINA_API_KEY: process.env.ZIINA_API_KEY || "your_ziina_api_key_here",
  ZIINA_API_BASE: process.env.ZIINA_API_BASE || "https://api.ziina.com",
  ZIINA_PAYMENT_INTENT_PATH:
    process.env.ZIINA_PAYMENT_INTENT_PATH || "/payment_intent",
  ZIINA_MOCK: process.env.ZIINA_MOCK === "true" || true, // Default to mock mode for development

  // Application Configuration
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // Default currency and pricing
  DEFAULT_CURRENCY: "AED",
  DEFAULT_ADULT_PRICE: 28.5,
  DEFAULT_CHILD_PRICE: 50.4,
  EXTRA_SERVICE_PER_BOOKING: 50,
  EXTRA_SERVICE_PER_PERSON: 24,
};

// Environment setup instructions
export const setupInstructions = `
To set up payment functionality:

1. Create a .env.local file in the root directory
2. Add the following variables:
   ZIINA_API_KEY=your_actual_ziina_api_key
   ZIINA_API_BASE=https://api.ziina.com
   ZIINA_PAYMENT_INTENT_PATH=/payment_intent
   ZIINA_MOCK=false
   NEXT_PUBLIC_APP_URL=http://localhost:3000

3. For production, update NEXT_PUBLIC_APP_URL to your actual domain
4. Set ZIINA_MOCK=false when ready for live payments
`;
