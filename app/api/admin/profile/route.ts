import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured. Please add Supabase credentials to .env.local' },
        { status: 503 }
      );
    }

    // Get user email from query parameter (for demo purposes)
    // In production, this would come from authentication session
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email') || 'admin@scanforaprize.com';

    // Get user by email
    let user;
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (!existingUser) {
      // If no user found and it's the master admin email, create it
      if (userEmail === 'admin@scanforaprize.com') {
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert({
            email: userEmail,
            role: 'master_admin',
            verified_at: new Date().toISOString(),
            is_subscribed: true, // Master admin has unlimited access
            company_name: 'Scan for a Prize'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating master admin user:', createError);
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          );
        }
        user = newUser;
      } else if (userEmail === 'demo-realtor@example.com') {
        // Create demo realtor user
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert({
            email: userEmail,
            role: 'realtor',
            verified_at: new Date().toISOString(),
            is_subscribed: false,
            company_name: 'Demo Realty'
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating demo realtor user:', createError);
          return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
          );
        }
        user = newUser;
      } else {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }
    } else {
      user = existingUser;
    }

    // Get total lead count (all properties for master admin, only owned for realtors)
    let leadQuery = supabaseAdmin.from('leads').select('id', { count: 'exact' });
    
    if (user.role === 'realtor') {
      // For realtors, only count leads from their claimed properties
      leadQuery = leadQuery.in('property_id', 
        supabaseAdmin
          .from('properties')
          .select('id')
          .eq('claimed_by_user_id', user.id)
      );
    }
    
    const { data: leadCount, error: leadError } = await leadQuery;

    if (leadError) {
      console.error('Error fetching lead count:', leadError);
      return NextResponse.json(
        { error: 'Failed to fetch lead count' },
        { status: 500 }
      );
    }

    // Get subscription details if user is subscribed
    let subscriptionData = null;
    if (user.is_subscribed) {
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('current_period_end, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      subscriptionData = subscription;
    }

    const profileData = {
      email: user.email,
      role: user.role || 'realtor',
      isSubscribed: user.is_subscribed,
      isMasterAdmin: user.role === 'master_admin',
      companyName: user.company_name,
      totalLeads: leadCount?.length || 0,
      subscriptionStatus: subscriptionData?.status || 'none',
      currentPeriodEnd: subscriptionData?.current_period_end || null,
    };

    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured. Please add Supabase credentials to .env.local' },
        { status: 503 }
      );
    }

    const { email } = await request.json();
    const demoEmail = 'admin@scanforaprize.com';

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Update demo user email
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .update({ email })
      .eq('email', demoEmail)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}