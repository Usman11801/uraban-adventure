# Loops Email Integration Setup

This guide explains how to set up Loops for sending booking confirmation emails.

## Prerequisites

1. Create a Loops account at [https://loops.so](https://loops.so)
2. Get your API key from the Loops dashboard

## Setup Steps

### 1. Add Environment Variable

Add your Loops API key to your `.env.local` file:

```env
LOOPS_API_KEY=your_loops_api_key_here
```

### 2. Create Transactional Email Template in Loops

1. Log in to your Loops dashboard
2. Go to **Transactional Emails** → **Create New**
3. Create a template with the ID: `booking-confirmation`
4. Use the following variables in your template:

   - `{{customerName}}` - Customer's full name
   - `{{bookingId}}` - Booking ID
   - `{{packageName}}` - Package/tour name
   - `{{travelDate}}` - Formatted travel date
   - `{{adults}}` - Number of adults
   - `{{children}}` - Number of children
   - `{{totalAmount}}` - Total amount with currency
   - `{{paymentMethod}}` - Payment method (Pay on Arrival or Online Payment)
   - `{{hotelName}}` - Hotel name or pickup location
   - `{{nationality}}` - Customer nationality
   - `{{addonsList}}` - List of selected addons
   - `{{bookingStatus}}` - Booking status
   - `{{supportEmail}}` - Support email address
   - `{{companyName}}` - Company name

### 3. Example Email Template

Here's a sample HTML template you can use in Loops:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #63AB45 0%, #F7921E 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .booking-details { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #63AB45; }
    .detail-row { margin: 10px 0; }
    .label { font-weight: bold; color: #555; }
    .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Booking Confirmation</h1>
    </div>
    <div class="content">
      <p>Dear {{customerName}},</p>
      <p>Thank you for your booking! We're excited to have you join us.</p>
      
      <div class="booking-details">
        <h2>Booking Details</h2>
        <div class="detail-row">
          <span class="label">Booking ID:</span> {{bookingId}}
        </div>
        <div class="detail-row">
          <span class="label">Package:</span> {{packageName}}
        </div>
        <div class="detail-row">
          <span class="label">Travel Date:</span> {{travelDate}}
        </div>
        <div class="detail-row">
          <span class="label">Guests:</span> {{adults}} Adult(s), {{children}} Child(ren)
        </div>
        <div class="detail-row">
          <span class="label">Total Amount:</span> {{totalAmount}}
        </div>
        <div class="detail-row">
          <span class="label">Payment Method:</span> {{paymentMethod}}
        </div>
        <div class="detail-row">
          <span class="label">Hotel/Pickup:</span> {{hotelName}}
        </div>
        <div class="detail-row">
          <span class="label">Nationality:</span> {{nationality}}
        </div>
        <div class="detail-row">
          <span class="label">Add-ons:</span>
          <pre style="margin: 5px 0; white-space: pre-wrap;">{{addonsList}}</pre>
        </div>
        <div class="detail-row">
          <span class="label">Status:</span> {{bookingStatus}}
        </div>
      </div>

      <p><strong>Important:</strong> Your booking is pending confirmation. You will receive another email once it's confirmed by our team.</p>
      
      <p>If you have any questions, please contact us at {{supportEmail}}.</p>
      
      <p>Best regards,<br>{{companyName}}</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply to this message.</p>
    </div>
  </div>
</body>
</html>
```

### 4. Test the Integration

1. Make a test booking with "Pay on Arrival" option
2. Check the server logs for email sending status
3. Verify the email is received in the customer's inbox

## Troubleshooting

- **Email not sending**: Check that `LOOPS_API_KEY` is set correctly in your `.env.local` file
- **Template not found**: Ensure the transactional email template ID is exactly `booking-confirmation` in Loops
- **Variables not showing**: Make sure all variable names match exactly (case-sensitive)

## Additional Configuration

You can also set a support email in your `.env.local`:

```env
SUPPORT_EMAIL=support@yourcompany.com
```

This will be used in the email template as `{{supportEmail}}`.

