# WhatsApp Business Automation Setup Guide

## Overview

This guide covers the complete setup of WhatsApp Business API automation for VELD AFRICA, enabling automated lead capture, property inquiries, appointment booking, and broadcast messaging.

---

## Features Implemented

### Core Features
- [x] Webhook handling for incoming messages
- [x] Automated welcome messages
- [x] Interactive menu (buttons & lists)
- [x] Property catalog browsing
- [x] Lead qualification flow
- [x] Appointment booking
- [x] Template message support
- [x] Broadcast campaigns
- [x] Message status tracking
- [x] Analytics dashboard

### Automation Flows
- Welcome sequence for new contacts
- Property inquiry handler
- Price range information
- Agro investment details
- Diaspora investor package
- Appointment booking
- Human handoff

---

## Prerequisites

1. **Meta Business Account**
   - Visit https://business.facebook.com
   - Create or access your business account

2. **WhatsApp Business API Access**
   - Apply for WhatsApp Business API
   - Or use embedded signup in Meta Developer portal

3. **Phone Number**
   - Dedicated phone number for WhatsApp
   - Must not be registered with WhatsApp consumer app

---

## Setup Instructions

### Step 1: Meta Developer Setup

1. Go to https://developers.facebook.com
2. Create a new app:
   - Select "Business" as app type
   - Add WhatsApp product

3. Configure WhatsApp:
   - Add phone number
   - Verify phone via OTP
   - Get Phone Number ID and Business Account ID

4. Generate Access Token:
   - Go to "Getting Started"
   - Generate permanent access token
   - Save securely

### Step 2: Environment Configuration

Add to your `.env` file:

```env
# WhatsApp Business API
WHATSAPP_PHONE_NUMBER_ID="your-phone-number-id"
WHATSAPP_BUSINESS_ACCOUNT_ID="your-business-account-id"
WHATSAPP_ACCESS_TOKEN="your-access-token"
WHATSAPP_API_VERSION="v17.0"
WHATSAPP_WEBHOOK_VERIFY_TOKEN="your-random-verify-token"
```

### Step 3: Webhook Configuration

1. Expose your local server:
   ```bash
   # Install ngrok
   npx ngrok http 3000
   ```

2. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

3. In Meta Developer Dashboard:
   - Go to WhatsApp > Configuration
   - Set Webhook URL: `https://abc123.ngrok.io/api/whatsapp/webhook`
   - Set Verify Token: Same as in .env
   - Subscribe to events:
     - `messages`
     - `message_template_status_update`

4. Verify webhook is working:
   ```bash
   curl -X GET "https://abc123.ngrok.io/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
   ```

### Step 4: Database Migration

Run the Prisma migration to add WhatsApp tables:

```bash
npx prisma migrate dev --name add_whatsapp
```

### Step 5: Test Setup

1. Send a test message to your WhatsApp number
2. Check database for incoming messages:
   ```sql
   SELECT * FROM whatsapp_contacts;
   SELECT * FROM whatsapp_messages;
   ```
3. Verify auto-reply is sent

---

## Automation Flows

### Flow 1: Welcome Sequence
```
New Contact → Welcome Message → Menu Options

Welcome Message:
"Hello and welcome to VELD AFRICA! 🏡

I'm your property investment assistant...

What would you like to explore today?"

Buttons:
- 🏠 Properties
- 📖 Get Guide
- 📅 Book Call
```

### Flow 2: Property Inquiry
```
User: "I want to see properties"
→ List Categories (Residential, Commercial, Agro, Dubai)
→ User selects category
→ Show properties in category with details
→ Options: Schedule viewing, Get brochure, Speak to advisor
```

### Flow 3: Lead Qualification
```
Conversation State Tracking:
- IDLE: Default state
- INQUIRY: Asked about properties/prices
- BOOKING: Scheduling appointment
- EDUCATION: Reading guides

Tags added based on:
- Budget range (if mentioned)
- Location interest
- Property type preference
```

### Flow 4: Human Handoff
```
User clicks "👨‍💼 Talk to Agent"
→ Send handoff message with contact info
→ Mark contact as lead
→ Tag: "human-handoff"
→ Set follow-up reminder (24h)
```

---

## Message Templates

### Creating Templates

Templates must be approved by Meta before use. Categories:
- **MARKETING**: Promotional messages
- **UTILITY**: Transactional messages
- **AUTHENTICATION**: OTP codes

### Sample Templates

**welcome_message**
```
Hello {{1}}, welcome to VELD AFRICA! 🏡

Your gateway to premium African real estate. Reply PROPERTIES to browse our listings.

Best regards,
VELD AFRICA Team
```

**property_alert**
```
🏠 New Property Alert!

{{1}} - {{2}}

Price: {{3}}
Location: {{4}}

Reply INTERESTED to schedule a viewing or visit {{5}}
```

**appointment_confirmation**
```
📅 Appointment Confirmed!

Date: {{1}}
Time: {{2}}
Property: {{3}}

Our agent will contact you at {{4}} to confirm.

Need to reschedule? Reply RESCHEDULE.
```

### API to Create Templates

```bash
curl -X POST "https://graph.facebook.com/v17.0/{business_account_id}/message_templates" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "veld_welcome",
    "category": "MARKETING",
    "language": "en",
    "components": [
      {
        "type": "BODY",
        "text": "Hello {{1}}, welcome to VELD AFRICA! 🏡\n\nYour gateway to premium African real estate."
      }
    ]
  }'
```

---

## API Endpoints

### Public Webhook
```
GET  /api/whatsapp/webhook     - Webhook verification
POST /api/whatsapp/webhook     - Receive messages
```

### Admin APIs
```
# Contacts
GET    /api/admin/whatsapp/contacts
POST   /api/admin/whatsapp/contacts

# Messages
GET    /api/admin/whatsapp/messages
POST   /api/admin/whatsapp/messages

# Templates
GET    /api/admin/whatsapp/templates
POST   /api/admin/whatsapp/templates

# Broadcasts
GET    /api/admin/whatsapp/broadcasts
POST   /api/admin/whatsapp/broadcasts

# Automations
GET    /api/admin/whatsapp/automations
POST   /api/admin/whatsapp/automations

# Stats
GET    /api/admin/whatsapp/stats
```

---

## Broadcast Campaigns

### Creating a Broadcast

1. Select template
2. Define segments (tags)
3. Set schedule
4. Review recipient count
5. Send or schedule

### Rate Limits
- Messages per second: 80
- Daily limit: Based on quality rating
- Use batching for large campaigns

---

## Testing

### Using Meta Developer Tools

1. Go to WhatsApp > API Setup
2. Select test phone number
3. Send test messages
4. View webhook logs

### Test Scenarios

```bash
# Test webhook verification
curl "http://localhost:3000/api/whatsapp/webhook?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"

# Send test message (using curl)
curl -X POST "https://graph.facebook.com/v17.0/{phone_number_id}/messages" \
  -H "Authorization: Bearer {access_token}" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "2348000000000",
    "type": "text",
    "text": {"body": "Test message from VELD"}
  }'
```

---

## Analytics

### Key Metrics

| Metric | Description |
|--------|-------------|
| Total Contacts | Number of WhatsApp users |
| Active Leads | Contacts marked as leads |
| Message Delivery Rate | Delivered / Sent |
| Read Rate | Read / Delivered |
| Response Rate | Replies / Received |

### Dashboard

Access at `/admin/whatsapp`

Shows:
- Message volume (24h, 7d, 30d)
- Conversation states
- Top performing templates
- Lead conversion funnel

---

## Troubleshooting

### Common Issues

**Webhook not receiving messages**
- Check verify token matches
- Ensure HTTPS URL
- Verify subscriptions are active
- Check server logs

**Messages failing to send**
- Verify access token is valid
- Check phone number ID is correct
- Ensure recipient has opted in
- Check rate limits

**Templates not approved**
- Follow Meta's template guidelines
- Avoid promotional language in UTILITY
- Provide clear opt-out instructions
- Wait 24-48h for review

### Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 131000 | Rate limit hit | Wait and retry |
| 131051 | Invalid phone | Check number format |
| 132000 | Template not found | Verify template name |
| 132001 | Template not approved | Wait for approval |

---

## Production Deployment

### Security Checklist

- [ ] Use HTTPS for webhook URL
- [ ] Rotate access tokens regularly
- [ ] Store credentials securely
- [ ] Validate all incoming webhooks
- [ ] Implement rate limiting
- [ ] Log security events

### Performance

- [ ] Use connection pooling for database
- [ ] Implement message queuing (Redis/Bull)
- [ ] Cache template data
- [ ] Use CDN for media

---

## Integration with Other Systems

### Newsletter Integration

```typescript
// Add WhatsApp to newsletter segments
const subscriber = await prisma.subscriber.update({
  where: { id: subscriberId },
  data: {
    preferences: {
      ...existingPrefs,
      whatsapp: true,
      phoneNumber: "234..."
    }
  }
});

// Send newsletter via WhatsApp
await sendWhatsAppMessage({
  phoneNumber: subscriber.phone,
  type: "template",
  templateName: "newsletter_digest",
  templateParams: [newsletterTitle, excerpt]
});
```

### CRM Integration

```typescript
// When lead is qualified
await prisma.whatsAppContact.update({
  where: { phoneNumber },
  data: {
    isLead: true,
    tags: { push: "hot-lead" },
    nextFollowUpAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
});
```

---

## Support & Resources

### Official Documentation
- [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp)
- [Message Templates](https://developers.facebook.com/docs/whatsapp/message-templates)
- [Webhooks](https://developers.facebook.com/docs/whatsapp/webhooks)

### VELD AFRICA Support
- Email: dev@veldafrica.com
- WhatsApp: +234 800 000 0000

---

**Setup Date**: 2026-03-22
**Version**: 1.0.0
