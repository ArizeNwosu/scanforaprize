import { createClient } from '@supabase/supabase-js'

// Check if environment variables are set and valid
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper function to check if URL is valid
const isValidSupabaseUrl = (url: string | undefined): boolean => {
  if (!url || url.includes('your-supabase-url-here') || url.length < 10) {
    return false
  }
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Helper function to check if key is valid
const isValidSupabaseKey = (key: string | undefined): boolean => {
  return !!(key && key.length > 20 && !key.includes('your-supabase') && key.startsWith('eyJ'))
}

// Create clients only if environment variables are available and valid
export const supabase = isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseAnonKey)
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

export const supabaseAdmin = isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseServiceKey)
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Database types
export interface Property {
  id: string
  slug: string
  address: string
  verification_code: string
  claimed_by_user_id: string | null
  created_at: string
}

export interface Lead {
  id: string
  property_id: string
  name: string
  email: string
  phone: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  verified_at: string | null
  is_subscribed: boolean
  stripe_customer_id: string | null
  created_at: string
}

export interface VerificationToken {
  id: string
  token: string
  user_id: string
  property_id: string
  expires_at: string
  created_at: string
}

export interface Subscription {
  id: string
  user_id: string
  property_id: string
  stripe_subscription_id: string
  status: string
  current_period_end: string
  created_at: string
}