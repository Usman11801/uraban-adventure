import { LoopsClient } from 'loops'

// Initialize Loops client
let loops = null

if (process.env.LOOPS_API_KEY) {
  try {
    loops = new LoopsClient(process.env.LOOPS_API_KEY)
  } catch (error) {
    console.error('Failed to initialize Loops client:', error)
  }
}

/**
 * Send booking confirmation email via Loops
 * @param {Object} bookingData - Booking information
 * @param {string} bookingData.customerEmail - Customer email address
 * @param {string} bookingData.customerName - Customer full name
 * @param {string} bookingData.bookingId - Booking ID
 * @param {string} bookingData.packageName - Package/tour name
 * @param {string} bookingData.travelDate - Travel date
 * @param {number} bookingData.adults - Number of adults
 * @param {number} bookingData.children - Number of children
 * @param {number} bookingData.totalAmount - Total amount
 * @param {string} bookingData.currency - Currency (default: AED)
 * @param {string} bookingData.paymentMethod - Payment method
 * @param {string} bookingData.hotelName - Hotel name or pickup location
 * @param {string} bookingData.nationality - Customer nationality
 * @param {Array} bookingData.addons - Selected addons
 * @returns {Promise<Object>} Loops API response
 */
export async function sendBookingConfirmationEmail(bookingData) {
  try {
    if (!process.env.LOOPS_API_KEY) {
      console.warn('LOOPS_API_KEY not set, skipping email send')
      return { success: false, error: 'Email service not configured' }
    }

    const {
      customerEmail,
      customerName,
      bookingId,
      packageName,
      travelDate,
      adults = 0,
      children = 0,
      totalAmount,
      currency = 'AED',
      paymentMethod,
      hotelName,
      nationality,
      addons = [],
    } = bookingData

    // Format travel date
    const formattedDate = travelDate
      ? new Date(travelDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'TBD'

    // Format addons list
    const addonsList = addons.length > 0
      ? addons.map(addon => `• ${addon.name} (${addon.adult || 0} adults, ${addon.child || 0} children)`)
      : ['• No addons selected']

    // Create email template data
    const emailData = {
      to: customerEmail,
      transactionalId: 'booking-confirmation',
      dataVariables: {
        customerName: customerName || 'Valued Customer',
        bookingId: bookingId || 'N/A',
        packageName: packageName || 'Tour Package',
        travelDate: formattedDate,
        adults: adults.toString(),
        children: children.toString(),
        totalAmount: `${totalAmount.toFixed(2)} ${currency}`,
        paymentMethod: paymentMethod === 'pay_on_arrival' ? 'Pay on Arrival' : 'Online Payment',
        hotelName: hotelName || 'Not specified',
        nationality: nationality || 'Not specified',
        addonsList: addonsList.join('\n'),
        bookingStatus: 'Pending Confirmation',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        companyName: 'Urban Adventure Tourism',
      },
    }

    // Send email via Loops
    if (!loops) {
      console.warn('Loops client not initialized, skipping email send')
      return { success: false, error: 'Email service not configured' }
    }

    const response = await loops.sendTransactionalEmail(emailData)

    if (response.success) {
      console.log(`Booking confirmation email sent to ${customerEmail} for booking ${bookingId}`)
      return { success: true, messageId: response.id }
    } else {
      console.error('Failed to send booking confirmation email:', response)
      return { success: false, error: response.message || 'Failed to send email' }
    }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    return { success: false, error: error.message || 'An error occurred while sending email' }
  }
}

/**
 * Send a simple transactional email via Loops
 * @param {string} to - Recipient email
 * @param {string} transactionalId - Loops transactional email ID
 * @param {Object} dataVariables - Template variables
 * @returns {Promise<Object>} Loops API response
 */
export async function sendTransactionalEmail(to, transactionalId, dataVariables = {}) {
  try {
    if (!loops) {
      console.warn('Loops client not initialized, skipping email send')
      return { success: false, error: 'Email service not configured' }
    }

    const response = await loops.sendTransactionalEmail({
      to,
      transactionalId,
      dataVariables,
    })

    return response
  } catch (error) {
    console.error('Error sending transactional email:', error)
    return { success: false, error: error.message }
  }
}

