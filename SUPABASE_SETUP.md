# Supabase Setup Guide for Scan for a Prize

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click "New Project"
3. Choose your organization
4. Set project name: "scanforaprize" (or any name you prefer)
5. Set a strong database password
6. Choose a region close to you
7. Click "Create new project"

### 2. Get Your API Keys

Once your project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like `https://your-project.supabase.co`)
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)
   - **service_role key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`)

### 3. Update Environment Variables

Edit your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Stripe Configuration (Optional - for payments)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 4. Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click "Run" to execute the SQL

This will create all the necessary tables:
- `properties` - Store property information and verification codes
- `users` - Store realtor accounts
- `leads` - Store visitor submissions
- `verification_tokens` - Handle email verification
- `subscriptions` - Track premium subscriptions

### 5. Test the Setup

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/admin`
3. Try adding a test property
4. If successful, you should see the property appear with generated codes

## 🎯 Testing the Full Flow

### Test Property Creation
1. Visit `/admin`
2. Add property: "123 Test Street, Sample City, TX 12345"
3. Note the generated slug and verification code

### Test QR Landing Page
1. Visit `/a/{generated-slug}`
2. Fill out the lead form
3. Check Supabase dashboard → **Table Editor** → **leads** to see the submission

### Test Claim Process
1. Visit `/claim`
2. Enter the property slug and verification code
3. Use any test email address
4. Check console logs for verification URL
5. Visit the verification URL to complete the process

## 🔧 Supabase Dashboard Features

### View Your Data
- **Table Editor**: See all your properties, leads, and users
- **SQL Editor**: Run custom queries
- **Logs**: Monitor API requests and errors

### Row Level Security (RLS)
The schema includes security policies that:
- Allow anyone to submit leads (for QR code scanning)
- Only allow property owners to view their leads
- Restrict admin operations to service role

### Real-time Features (Optional)
You can enable real-time subscriptions to see leads come in live:
```javascript
// In your dashboard component
supabase
  .channel('leads')
  .on('postgres_changes', { 
    event: 'INSERT', 
    schema: 'public', 
    table: 'leads' 
  }, payload => {
    console.log('New lead!', payload)
  })
  .subscribe()
```

## ✅ Advantages of Supabase

1. **Instant Setup** - No local database configuration needed
2. **Built-in Auth** - Easy to add user authentication later
3. **Real-time** - Get live updates when leads are submitted
4. **Dashboard** - Visual interface to manage your data
5. **Scalable** - Handles growth automatically
6. **Free Tier** - 50,000 monthly requests, 500MB database
7. **PostgreSQL** - Full SQL database with advanced features

## 🚨 Important Notes

- **Environment Variables**: Never commit your service role key to version control
- **RLS Policies**: The schema includes security policies - don't disable them without understanding the implications
- **Free Tier Limits**: Monitor your usage in the Supabase dashboard
- **Backups**: Supabase handles backups automatically on paid plans

## 🛠 Troubleshooting

### "Failed to connect to Supabase"
- Check your environment variables are correct
- Ensure your Supabase project is running (not paused due to inactivity)

### "Row Level Security violation"
- Check that RLS policies are properly set up
- Ensure you're using the correct API key (anon vs service role)

### "Table doesn't exist"
- Make sure you ran the SQL schema in the Supabase SQL Editor
- Check the table names match exactly (case-sensitive)

Your Supabase setup is complete! The application should now work seamlessly with a cloud database instead of local SQLite.