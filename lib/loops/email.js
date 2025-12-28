import { LoopsClient } from 'loops'

// Initialize Loops client - support both LOOPS_API_KEY and NEXT_LOOP_KEY
let loops = null
const apiKey = process.env.LOOPS_API_KEY || process.env.NEXT_LOOP_KEY

if (apiKey) {
  try {
    loops = new LoopsClient(apiKey)
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
    const apiKey = process.env.LOOPS_API_KEY || process.env.NEXT_LOOP_KEY
    if (!apiKey) {
      console.warn('LOOPS_API_KEY or NEXT_LOOP_KEY not set, skipping email send')
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

    // Validate email address
    if (!customerEmail || !customerEmail.trim() || !customerEmail.includes('@')) {
      console.error('Invalid or missing customer email:', customerEmail)
      return { success: false, error: 'Invalid or missing customer email address' }
    }

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
    // Loops API requires 'email' field instead of 'to'
    const emailData = {
      email: customerEmail.trim(), // Use 'email' field as required by Loops API
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

    console.log('Sending booking confirmation email to:', customerEmail.trim())
    console.log('Email data prepared:', { email: emailData.email, transactionalId: emailData.transactionalId })

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
      console.error('Failed to send booking confirmation email. Response:', JSON.stringify(response, null, 2))
      return { success: false, error: response.message || 'Failed to send email' }
    }
  } catch (error) {
    console.error('Error sending booking confirmation email:', error)
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      json: error.json,
      email: customerEmail,
      transactionalId: 'booking-confirmation'
    })
    return { 
      success: false, 
      error: error.message || 'An error occurred while sending email',
      details: error.json || error
    }
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

    // Validate email address
    if (!to || !to.trim() || !to.includes('@')) {
      console.error('Invalid or missing email address:', to)
      return { success: false, error: 'Invalid or missing email address' }
    }

    // Loops API requires 'email' field instead of 'to'
    const response = await loops.sendTransactionalEmail({
      email: to.trim(), // Use 'email' field as required by Loops API
      transactionalId,
      dataVariables,
    })

    return response
  } catch (error) {
    console.error('Error sending transactional email:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Send package approval email via Loops
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
export async function sendPackageApprovalEmail(bookingData) {
  try {
    const apiKey = process.env.LOOPS_API_KEY || process.env.NEXT_LOOP_KEY
    if (!apiKey) {
      console.warn('LOOPS_API_KEY or NEXT_LOOP_KEY not set, skipping email send')
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

    // Validate email address
    if (!customerEmail || !customerEmail.trim() || !customerEmail.includes('@')) {
      console.error('Invalid or missing customer email:', customerEmail)
      return { success: false, error: 'Invalid or missing customer email address' }
    }

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

    // Create email template data with the specific template ID for package approval
    // Loops API requires 'email' field instead of 'to'
    const emailData = {
      email: customerEmail.trim(), // Use 'email' field as required by Loops API
      transactionalId: 'cmjorwtnk01y80iyt2mg5k9hm', // Package approval template ID
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
        bookingStatus: 'Approved',
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        companyName: 'Urban Adventure Tourism',
      },
    }

    console.log('Sending package approval email to:', customerEmail.trim())
    console.log('Email data prepared:', { email: emailData.email, transactionalId: emailData.transactionalId })

    // Send email via Loops
    if (!loops) {
      console.warn('Loops client not initialized, skipping email send')
      return { success: false, error: 'Email service not configured' }
    }

    const response = await loops.sendTransactionalEmail(emailData)

    if (response.success) {
      console.log(`Package approval email sent to ${customerEmail} for booking ${bookingId}`)
      return { success: true, messageId: response.id }
    } else {
      console.error('Failed to send package approval email. Response:', JSON.stringify(response, null, 2))
      return { success: false, error: response.message || 'Failed to send email' }
    }
  } catch (error) {
    console.error('Error sending package approval email:', error)
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      json: error.json,
      email: customerEmail,
      transactionalId: 'cmjorwtnk01y80iyt2mg5k9hm'
    })
    return { 
      success: false, 
      error: error.message || 'An error occurred while sending email',
      details: error.json || error
    }
  }
}

/**
 * Send guide assignment email via Loops
 * @param {Object} assignmentData - Assignment information
 * @param {string} assignmentData.guideEmail - Guide email address
 * @param {string} assignmentData.guideName - Guide name
 * @param {string} assignmentData.bookingId - Booking ID
 * @param {string} assignmentData.packageName - Package/tour name
 * @param {string} assignmentData.customerName - Customer name
 * @param {string} assignmentData.travelDate - Travel date
 * @param {string} assignmentData.customerPhone - Customer phone number
 * @param {string} assignmentData.hotelName - Hotel/pickup location
 * @param {number} assignmentData.adults - Number of adults
 * @param {number} assignmentData.children - Number of children
 * @returns {Promise<Object>} Loops API response
 */
export async function sendGuideAssignmentEmail(assignmentData) {
  try {
    const apiKey = process.env.LOOPS_API_KEY || process.env.NEXT_LOOP_KEY
    if (!apiKey) {
      console.warn('LOOPS_API_KEY or NEXT_LOOP_KEY not set, skipping email send')
      return { success: false, error: 'Email service not configured' }
    }

    const {
      guideEmail,
      guideName,
      bookingId,
      packageName,
      customerName,
      travelDate,
      customerPhone,
      hotelName,
      adults = 0,
      children = 0,
    } = assignmentData

    // Validate email address
    if (!guideEmail || !guideEmail.trim() || !guideEmail.includes('@')) {
      console.error('Invalid or missing guide email:', guideEmail)
      return { success: false, error: 'Invalid or missing guide email address' }
    }

    // Format travel date
    const formattedDate = travelDate
      ? new Date(travelDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'TBD'

    // Create email template data with the specific template ID for guide assignment
    const emailData = {
      email: guideEmail.trim(), // Use 'email' field as required by Loops API
      transactionalId: 'cmjotm0y8127m0hz422nu7395', // Guide assignment template ID
      dataVariables: {
        guideName: guideName || 'Guide',
        bookingId: bookingId || 'N/A',
        packageName: packageName || 'Tour Package',
        customerName: customerName || 'Customer',
        travelDate: formattedDate,
        customerPhone: customerPhone || 'Not provided',
        hotelName: hotelName || 'Not specified',
        adults: adults.toString(),
        children: children.toString(),
        totalGuests: (parseInt(adults) + parseInt(children)).toString(),
        supportEmail: process.env.SUPPORT_EMAIL || 'support@example.com',
        companyName: 'Urban Adventure Tourism',
      },
    }

    console.log('Sending guide assignment email to:', guideEmail.trim())
    console.log('Email data prepared:', { email: emailData.email, transactionalId: emailData.transactionalId })

    // Send email via Loops
    if (!loops) {
      console.warn('Loops client not initialized, skipping email send')
      return { success: false, error: 'Email service not configured' }
    }

    const response = await loops.sendTransactionalEmail(emailData)

    if (response.success) {
      console.log(`Guide assignment email sent to ${guideEmail} for booking ${bookingId}`)
      return { success: true, messageId: response.id }
    } else {
      console.error('Failed to send guide assignment email. Response:', JSON.stringify(response, null, 2))
      return { success: false, error: response.message || 'Failed to send email' }
    }
  } catch (error) {
    console.error('Error sending guide assignment email:', error)
    console.error('Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      json: error.json,
      email: assignmentData.guideEmail,
      transactionalId: 'cmjotm0y8127m0hz422nu7395'
    })
    return { 
      success: false, 
      error: error.message || 'An error occurred while sending email',
      details: error.json || error
    }
  }
}

