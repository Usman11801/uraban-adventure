# Tawk.to Live Chat Setup Guide

This guide will help you set up tawk.to live chat widget on your Dubai Tourism website.

## What is tawk.to?

tawk.to is a free live chat software that allows you to communicate with your website visitors in real-time. It's 100% free to use and includes features like:
- Unlimited agents
- Mobile apps for iOS and Android
- Chat history and analytics
- Customizable widget appearance
- Multi-language support

## Step 1: Create a tawk.to Account

1. Visit [https://www.tawk.to/](https://www.tawk.to/)
2. Click **"Get started - Free"** button
3. Sign up with your email address or use Google/Apple sign-in
4. Verify your email address if required

## Step 2: Create a Property

1. After logging in, you'll be prompted to create your first "Property"
2. A Property represents your website or application
3. Enter your property name (e.g., "Dubai Tourism Website")
4. Click **"Create Property"**

## Step 3: Get Your Property ID and Widget ID

1. Once your property is created, you'll be taken to the dashboard
2. Go to **Administration** → **Channels** (or click on your property name)
3. You should see a default channel/widget already created
4. Click on the channel/widget to view its details
5. In the widget settings, you'll find:
   - **Property ID**: A long alphanumeric string (e.g., `5f7a8b9c0d1e2f3a4b5c6d7`)
   - **Widget ID**: Another alphanumeric string (e.g., `default` or a custom ID)

### Alternative Method to Find IDs

If you can't find the IDs in the dashboard:

1. Go to **Administration** → **Channels**
2. Click on **"Add Channel"** or select your existing channel
3. In the channel settings, look for the **"Installation"** or **"Setup"** section
4. You'll see a JavaScript code snippet that looks like this:

```javascript
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/YOUR_WIDGET_ID';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
```

5. Extract the IDs from the URL: `https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`
   - The first part after `/embed.tawk.to/` is your **Property ID**
   - The second part is your **Widget ID**

### Getting Your JavaScript API Key (Optional but Recommended)

The JavaScript API Key enables advanced features like programmatic control of the widget:

1. Go to **Administration** → **Channels**
2. Click on your widget/channel
3. Navigate to **Settings** → **JavaScript API**
4. Copy your **JavaScript API Key** (a long alphanumeric string)

**Note:** The API Key is optional but recommended if you want to use advanced JavaScript API features.

## Step 4: Configure Environment Variables

1. Open your `.env.local` file in the `DubWebsite` directory
2. Find the tawk.to configuration section (should be at the bottom)
3. Replace the placeholder values with your actual credentials:

```env
NEXT_PUBLIC_TAWK_TO_PROPERTY_ID=your_actual_property_id_here
NEXT_PUBLIC_TAWK_TO_WIDGET_ID=your_actual_widget_id_here
NEXT_PUBLIC_TAWK_TO_API_KEY=your_javascript_api_key_here
```

**Example:**
```env
NEXT_PUBLIC_TAWK_TO_PROPERTY_ID=69540ad0e560e4197a4d62fd
NEXT_PUBLIC_TAWK_TO_WIDGET_ID=1jdo4kfq4
NEXT_PUBLIC_TAWK_TO_API_KEY=80ffd812e0acc3151a4973b6eccab10dc4aea709
```

**Note:** The API Key is optional - the widget will work without it, but adding it enables advanced JavaScript API features.

4. Save the file

## Step 5: Restart Your Development Server

After updating the environment variables:

1. Stop your current development server (if running) by pressing `Ctrl+C`
2. Restart it with:
   ```bash
   npm run dev
   ```

**Note:** Next.js requires a server restart to pick up new environment variables.

## Step 6: Verify the Integration

1. Open your website in a browser (usually `http://localhost:3000`)
2. Look for the tawk.to chat widget in the bottom-right corner of the page
3. Click on the widget to open the chat window
4. You should see a welcome message or chat interface

If the widget doesn't appear:
- Check the browser console (F12) for any error messages
- Verify that your environment variables are correctly set
- Make sure you've restarted the development server
- Check that the Property ID and Widget ID are correct (no extra spaces or quotes)

## Step 7: Customize Your Widget (Optional)

You can customize the appearance and behavior of your chat widget:

1. Go to your tawk.to dashboard
2. Navigate to **Administration** → **Channels**
3. Click on your widget/channel
4. Go to **Widget** settings
5. Customize:
   - **Widget Color**: Match your brand colors
   - **Widget Position**: Bottom-right (default), bottom-left, etc.
   - **Welcome Message**: Set a custom greeting
   - **Widget Text**: Customize button text
   - **Offline Message**: What visitors see when you're offline

## Step 8: Add Team Members (Agents)

To allow your team to respond to chats:

1. Go to **Administration** → **Agents**
2. Click **"Add Agent"**
3. Enter the agent's email address
4. Choose their role (Agent, Admin, etc.)
5. The agent will receive an email invitation
6. They can download the tawk.to mobile app or use the web dashboard

## Step 9: Test the Chat Functionality

1. Open your website in an incognito/private browser window (to simulate a visitor)
2. Click on the chat widget
3. Send a test message
4. Log in to your tawk.to dashboard from another browser/device
5. You should see the chat appear in your dashboard
6. Respond to test the two-way communication

## Troubleshooting

### Widget Not Appearing

- **Check Environment Variables**: Ensure `NEXT_PUBLIC_TAWK_TO_PROPERTY_ID` and `NEXT_PUBLIC_TAWK_TO_WIDGET_ID` are set correctly
- **Server Restart**: Make sure you've restarted your Next.js development server
- **Browser Console**: Check for JavaScript errors in the browser console (F12)
- **Network Tab**: Verify the tawk.to script is loading (check Network tab in DevTools)

### Widget Appears But Chat Doesn't Work

- **Account Status**: Verify your tawk.to account is active
- **Widget Status**: Check in the dashboard that the widget is enabled
- **Browser Compatibility**: Try a different browser
- **Ad Blockers**: Disable ad blockers as they may block the chat widget

### Environment Variables Not Working

- **NEXT_PUBLIC_ Prefix**: Ensure variables start with `NEXT_PUBLIC_` (required for client-side access in Next.js)
- **No Quotes**: Don't wrap values in quotes in `.env.local`
- **No Spaces**: Remove any spaces around the `=` sign
- **File Location**: Ensure `.env.local` is in the `DubWebsite` directory (root of your Next.js app)

## Additional Resources

- [tawk.to Help Center](https://help.tawk.to/)
- [tawk.to Documentation](https://developer.tawk.to/)
- [tawk.to Dashboard](https://dashboard.tawk.to/)

## Support

If you encounter issues:
1. Check the tawk.to Help Center
2. Contact tawk.to support through their website (they offer 24/7 support)
3. Review the browser console for specific error messages

## Next Steps

After setup:
- Customize your widget appearance to match your brand
- Set up automated responses for common questions
- Train your team on using the tawk.to dashboard
- Monitor chat analytics to understand visitor needs
- Consider setting up chat routing rules for different departments

---

**Note:** The tawk.to widget is now integrated into your `ReveloLayout` component, which means it will appear on all pages that use this layout. The widget loads automatically when the page loads, and visitors can start chatting immediately.

