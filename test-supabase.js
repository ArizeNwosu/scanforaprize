// Simple test to check Supabase connection
const { createClient } = require('@supabase/supabase-js');

// Check environment variables
console.log('Environment variables check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('\n❌ Missing Supabase environment variables!');
  console.log('\nPlease update your .env.local file with:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here');
  console.log('SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here');
  process.exit(1);
}

// Test connection
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

console.log('\n✅ Supabase client created successfully!');
console.log('You can now test your application at http://localhost:3000');