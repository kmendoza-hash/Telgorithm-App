# 🌌 Cosmic Texts - Astrophysics SMS Subscription Site (Telgorithm Version)

A serverless website where users can subscribe to receive weekly inspiring text messages about astrophysics, powered by Telgorithm's SMS API.

## ⚠️ Important Volume Requirements

**Telgorithm requires a minimum of 500,000 messages per month.** This makes it ideal for:
- High-volume platforms with many users
- Marketing campaigns reaching large audiences
- Enterprise-level messaging applications

**Not suitable for:**
- Small personal projects (like this example with weekly messages to <100k subscribers)
- Low-volume newsletters
- Testing/proof-of-concept applications

### Alternative Providers for Smaller Projects

If you expect lower volume, consider these alternatives:
- **Twilio**: No minimum, ~$0.0079/message
- **Telnyx**: No minimum, ~$0.004/message
- **AWS SNS**: Pay-as-you-go, ~$0.00645/message

The Twilio version of this project is available in the original files.

## Features

- 📱 Simple subscription form
- 🚀 Serverless architecture (no servers to manage!)
- 💾 Airtable database for subscriber management
- 📲 Telgorithm for high-volume 10DLC SMS delivery
- ⏰ Automated weekly messages via GitHub Actions
- 🎨 Beautiful, responsive design

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Netlify Functions (Node.js serverless)
- **Database**: Airtable
- **SMS Provider**: Telgorithm (10DLC specialist)
- **Scheduling**: GitHub Actions
- **Hosting**: Netlify

## Telgorithm Benefits

If you meet the volume requirements, Telgorithm offers:
- **Better deliverability**: 99%+ average delivery rates
- **10DLC expertise**: Specialized in Application-to-Person messaging
- **Smart Queueing**: Patented technology for managing rate limits
- **Automated registration**: Streamlined 10DLC compliance
- **Competitive pricing**: Starting at $0.005/message
- **Superior support**: Dedicated Slack channels and implementation managers

## Setup Instructions

### 1. Prerequisites

- [Netlify account](https://www.netlify.com/) (free)
- [Airtable account](https://airtable.com/) (free)
- [Telgorithm account](https://www.telgorithm.com/) (requires 500K/month minimum)
- [GitHub account](https://github.com/) (free)

### 2. Set Up Airtable

1. Go to [Airtable](https://airtable.com/) and create a new base
2. Create a table called **Subscribers** with these fields:
   - `Name` (Single line text)
   - `Phone` (Phone number)
   - `Subscribed Date` (Date)
   - `Active` (Checkbox)
3. Get your API credentials:
   - Go to https://airtable.com/account
   - Click "Generate API key" and copy it
   - Go to https://airtable.com/api
   - Select your base and copy the Base ID (starts with "app...")

### 3. Set Up Telgorithm

**Important**: You must be registered as a Campaign Service Provider (CSP) with The Campaign Registry (TCR).

1. Sign up at [Telgorithm](https://www.telgorithm.com/)
2. Request a 30-day trial (if eligible)
3. Complete CSP registration with TCR:
   - Register your brand
   - Create a campaign for your use case
   - Select Telgorithm as connectivity partner
4. Get your credentials from the Telgorithm dashboard:
   - API Key
   - Phone number (10DLC enabled)

### 4. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Easiest)

1. Push this code to a GitHub repository
2. Go to [Netlify](https://app.netlify.com/)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Netlify will auto-detect settings from `netlify.toml`
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify init
netlify deploy --prod
```

### 5. Configure Environment Variables

In Netlify dashboard:

1. Go to Site settings → Environment variables
2. Add these variables:

```
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_airtable_base_id
TELGORITHM_API_KEY=your_telgorithm_api_key
TELGORITHM_PHONE_NUMBER=+1234567890
CRON_SECRET=generate_a_random_string_here
```

To generate `CRON_SECRET`, run:
```bash
openssl rand -hex 32
```

### 6. Set Up GitHub Actions for Weekly Messages

1. In your GitHub repository, go to Settings → Secrets and variables → Actions
2. Add a new secret:
   - Name: `CRON_SECRET`
   - Value: (same value you used in Netlify)

3. Edit `.github/workflows/send-messages.yml`:
   - Replace `YOUR-SITE-NAME` with your actual Netlify site name
   - Adjust the cron schedule if needed (default: Sundays at 10 AM UTC)

4. The workflow will automatically run weekly. You can also trigger it manually:
   - Go to Actions tab → "Send Weekly Astrophysics Messages" → "Run workflow"

## Testing

### Test the Subscription Function

```bash
# Local testing (after setting up .env file)
npm install
netlify dev

# Visit http://localhost:8888 and test the form
```

### Test the Weekly Message Function

```bash
# Use curl to trigger manually (replace with your values)
curl -X POST \
  -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-site.netlify.app/.netlify/functions/send-weekly-messages
```

## File Structure

```
astrophysics-sms-telgorithm/
├── index.html                          # Main subscription page
├── netlify.toml                        # Netlify configuration
├── package.json                        # Node dependencies
├── .env.example                        # Environment variables template
├── .gitignore                          # Git ignore rules
├── netlify/
│   └── functions/
│       ├── subscribe.js                # Handles form submissions
│       └── send-weekly-messages.js     # Sends weekly SMS via Telgorithm
└── .github/
    └── workflows/
        └── send-messages.yml           # Weekly cron job
```

## API Integration Details

### Telgorithm API

The code uses Telgorithm's REST API (OpenAPI standard):

```javascript
// Send SMS
axios.post('https://api.telgorithm.com/messaging/messages', {
  to: '+1234567890',
  from: process.env.TELGORITHM_PHONE_NUMBER,
  text: 'Your message here'
}, {
  headers: {
    'Authorization': `Bearer ${TELGORITHM_API_KEY}`,
    'Content-Type': 'application/json'
  }
});
```

### Error Handling

Telgorithm provides detailed error responses. Check function logs for:
- Rate limiting issues
- 10DLC compliance problems
- Phone number validation errors
- Campaign registration status

## Customization

### Add More Astrophysics Facts

Edit `netlify/functions/send-weekly-messages.js` and add items to the `astrophysicsFacts` array.

### Change Schedule

Edit `.github/workflows/send-messages.yml` and modify the cron expression:
- `0 10 * * 0` = Every Sunday at 10:00 AM UTC
- `0 14 * * 3` = Every Wednesday at 2:00 PM UTC
- Use [crontab.guru](https://crontab.guru/) to create custom schedules

### Customize Design

Edit `index.html` - all styles are inline in the `<style>` section.

## Cost Breakdown

Assuming you meet the 500K/month minimum:

- **Netlify**: Free (up to 125k function invocations/month)
- **Airtable**: Free (up to 1,200 records)
- **GitHub Actions**: Free (2,000 minutes/month)
- **Telgorithm**: 
  - Pricing starts at $0.005 per message
  - Phone number: Included in service
  - Free number porting
  - No hidden fees
  - Example: 500K messages/month = $2,500/month minimum

**For smaller volumes (< 500K/month)**, use the Twilio version instead.

## 10DLC Compliance

Telgorithm specializes in 10DLC (10-digit long code) messaging:

1. **Campaign Registration Required**: You must register your use case with TCR
2. **Brand Verification**: $4 one-time fee
3. **Campaign Vetting**: $15 per campaign
4. **Automated Process**: Telgorithm streamlines this process

### Campaign Use Case

For this astrophysics newsletter, you might register as:
- **Campaign Type**: Educational Content
- **Description**: Weekly educational messages about astrophysics and space science
- **Opt-in Method**: Web form with explicit consent

## Telgorithm Features Utilized

This implementation uses:
- **Basic SMS sending**: Simple text messages
- **Smart Queueing**: Automatic handling of carrier rate limits
- **Automated error reporting**: Detailed error descriptions

### Advanced Features Available

Telgorithm also offers (not implemented in this basic version):
- **MMS support**: Send images/videos
- **Conversation metadata**: Track custom data across threads
- **Phone verification**: Validate numbers before sending
- **Delivery receipts**: Track message delivery status
- **Group messaging**: Multi-participant threads

## Migration from Other Providers

If you're switching from Twilio, Telnyx, or another provider:

1. **Campaign Migration**: Use TCR's migration tool (if you're a CSP)
2. **Number Porting**: Telgorithm's automated porting (free)
3. **Code Changes**: Minimal - just swap the API client (see comparison below)

### Twilio → Telgorithm Code Changes

```javascript
// BEFORE (Twilio)
const twilio = require('twilio');
const client = twilio(accountSid, authToken);
await client.messages.create({
  body: message,
  from: twilioNumber,
  to: phone
});

// AFTER (Telgorithm)
const axios = require('axios');
await axios.post('https://api.telgorithm.com/messaging/messages', {
  text: message,
  from: telgorithmNumber,
  to: phone
}, {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});
```

## Troubleshooting

### Messages not sending?

1. Check Netlify function logs: Site → Functions → send-weekly-messages
2. Verify Telgorithm API key is correct
3. Confirm phone number is 10DLC registered
4. Check campaign approval status in Telgorithm dashboard

### "Minimum volume not met" error?

Telgorithm requires 500K messages/month. If you're below this:
- Use the Twilio version of this project instead
- Or combine multiple projects to meet the minimum

### 10DLC registration issues?

1. Contact Telgorithm support (they offer hands-on help)
2. Check TCR dashboard for campaign status
3. Review campaign rejection reasons
4. Ensure brand verification is complete

### Form not submitting?

1. Open browser console for JavaScript errors
2. Check Netlify function logs
3. Verify Airtable credentials and table name

## Support

- **Telgorithm Support**: Dedicated Slack channel (provided during onboarding)
- **Netlify**: Check function logs in dashboard
- **Airtable**: Review API documentation
- **10DLC/TCR**: Contact Telgorithm's compliance team

## Comparison: When to Use Telgorithm

| Feature | Telgorithm | Twilio | Telnyx |
|---------|-----------|--------|--------|
| **Minimum Volume** | 500K/month | None | None |
| **Price per SMS** | $0.005+ | $0.0079 | $0.004 |
| **10DLC Specialty** | ✅ Yes | Basic | Basic |
| **Deliverability** | 99%+ | ~98% | ~98% |
| **Best For** | High volume platforms | All sizes | Cost-conscious |

## License

MIT License - feel free to use and modify!

---

Built with 💜 for space enthusiasts everywhere 🌠

**Note**: This is the Telgorithm version optimized for high-volume messaging (500K+/month). For smaller projects, use the Twilio version instead.
