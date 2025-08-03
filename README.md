# Scan for a Prize - Realtor Lead Capture Tool

A comprehensive lead capture system that allows placing QR codes on realtor yard signs without permission, with secure claim verification.

## Features

- **QR Code Lead Capture**: Each property gets a unique QR code URL for lead collection
- **Secure Verification**: Physical verification codes prevent unauthorized access
- **Email Verification**: Magic link authentication for realtors
- **Freemium Model**: 10 free leads per property, subscription for unlimited access
- **Admin Dashboard**: Property management and lead analytics
- **CSV Export**: Download leads for subscribed users
- **Stripe Integration**: Secure payment processing

## System Architecture

### Core Components

1. **QR Landing Pages** (`/a/{slug}`)
   - Public lead capture forms
   - Unique 60-character URLs per property

2. **Claim System** (`/claim`)
   - Property verification via slug + verification code
   - Email verification with magic links

3. **Dashboard** (`/dashboard`)
   - Lead viewing with freemium limits
   - Subscription upgrade options

4. **Admin Backend** (`/admin`)
   - Property creation and management
   - Lead statistics and slip generation

### Security Model

- **Unique Slugs**: 60-character URL-safe identifiers prevent guessing
- **Verification Codes**: 6-12 character codes require physical property access
- **Email Verification**: Magic links ensure legitimate realtor access

## Setup Instructions

### 1. Environment Variables

Copy `.env.local` and configure:

```bash
# Database (Vercel Postgres recommended)
POSTGRES_URL=postgresql://...
POSTGRES_PRISMA_URL=postgresql://...
POSTGRES_URL_NO_SSL=postgresql://...
POSTGRES_URL_NON_POOLING=postgresql://...

# Authentication
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Email (Gmail SMTP example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Database Setup

```bash
npm install
npm run db:generate
npm run db:migrate
```

### 3. Stripe Configuration

1. Create products in Stripe Dashboard:
   - Single Property: $19/month
   - 5 Properties: $59/month

2. Update price IDs in `lib/stripe.ts`:
   ```typescript
   export const SUBSCRIPTION_PLANS = {
     single: {
       priceId: 'price_1234...', // Your actual price ID
       // ...
     },
     // ...
   };
   ```

3. Set up webhook endpoint: `/api/webhooks/stripe`

### 4. Email Configuration

For Gmail:
1. Enable 2-factor authentication
2. Generate App Password
3. Use App Password in `EMAIL_PASS`

### 5. Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## Usage Workflow

### For Administrators

1. **Add Property** (`/admin`)
   - Enter property address
   - System generates unique slug + verification code
   - Print verification slip for property

2. **Place QR Code**
   - Generate QR for URL: `https://scanforaprize.com/a/{slug}`
   - Place on yard sign
   - Slide verification slip under door

### For Realtors

1. **Claim Property** (`/claim`)
   - Enter slug from QR URL
   - Enter verification code from slip
   - Verify email via magic link

2. **Access Leads** (`/dashboard`)
   - View first 10 leads (free)
   - Subscribe for unlimited access
   - Export leads as CSV (premium)

### For Visitors

1. **Scan QR Code**
   - Opens lead capture form
   - Enter name, email, phone (optional)
   - Submit for prize entry

## Database Schema

- **properties**: Property details with slugs and verification codes
- **leads**: Visitor submissions linked to properties
- **users**: Realtor accounts with subscription status
- **verification_tokens**: Magic link tokens for email verification
- **subscriptions**: Stripe subscription tracking

## API Endpoints

- `POST /api/leads` - Submit new lead
- `POST /api/verify-property` - Check if property exists
- `POST /api/claim-property` - Claim property with verification
- `GET /api/export-leads` - Download leads CSV
- `POST /api/create-checkout-session` - Start Stripe subscription
- `POST /api/webhooks/stripe` - Handle Stripe events

## Security Considerations

- Slugs are cryptographically random (60 chars)
- Verification codes require physical access
- Email verification prevents spoofing
- HTTPS required for production
- Stripe webhooks verify payment status

## Deployment

1. **Vercel** (Recommended)
   - Automatic PostgreSQL database
   - Built-in environment variable management
   - Stripe integration support

2. **Environment Setup**
   - Configure all environment variables
   - Set up Stripe webhook URLs
   - Configure email service

3. **Database Migration**
   ```bash
   npm run db:migrate
   ```

## Support

For issues or feature requests, check the system logs and ensure all environment variables are properly configured.