import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured. Please add Supabase credentials to .env.local' },
        { status: 503 }
      );
    }

    const { action } = await request.json();
    const demoEmail = 'admin@scanforaprize.com';

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', demoEmail)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (action === 'upgrade') {
      // In a real app, this would integrate with Stripe
      // For demo, we'll simulate an upgrade
      
      // Update user to subscribed
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ 
          is_subscribed: true,
          stripe_customer_id: 'cus_demo_customer'
        })
        .eq('id', user.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to upgrade subscription' },
          { status: 500 }
        );
      }

      // Create subscription record
      const { error: subError } = await supabaseAdmin
        .from('subscriptions')
        .insert({
          user_id: user.id,
          property_id: null, // Not property-specific
          stripe_subscription_id: 'sub_demo_subscription',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
        });

      if (subError) {
        console.error('Error creating subscription:', subError);
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Successfully upgraded to Pro plan!',
        redirectUrl: '/admin' 
      });

    } else if (action === 'cancel') {
      // Cancel subscription
      const { error: updateError } = await supabaseAdmin
        .from('users')
        .update({ is_subscribed: false })
        .eq('id', user.id);

      if (updateError) {
        return NextResponse.json(
          { error: 'Failed to cancel subscription' },
          { status: 500 }
        );
      }

      // Update subscription status
      await supabaseAdmin
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('user_id', user.id);

      return NextResponse.json({ 
        success: true, 
        message: 'Subscription canceled successfully',
        redirectUrl: '/admin' 
      });

    } else if (action === 'manage') {
      // In production, this would redirect to Stripe billing portal
      return NextResponse.json({ 
        success: true,
        message: 'Redirecting to billing portal...',
        redirectUrl: 'https://billing.stripe.com/p/login/demo' // Demo URL
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to manage subscription' },
      { status: 500 }
    );
  }
}