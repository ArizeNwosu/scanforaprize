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

    const { 
      email, 
      name, 
      phone, 
      password, 
      companyName, 
      claimId, 
      propertyId 
    } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: 'Email, name, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Check if this is a claim-based signup or standard signup
    const isClaimSignup = claimId && propertyId;
    let claim = null;

    if (isClaimSignup) {
      // Verify the claim exists and is valid
      const { data: claimData, error: claimError } = await supabaseAdmin
        .from('property_claims')
        .select('*')
        .eq('id', claimId)
        .eq('realtor_email', email)
        .single();

      if (claimError || !claimData) {
        return NextResponse.json(
          { error: 'Invalid or expired claim. Please restart the claim process.' },
          { status: 400 }
        );
      }
      claim = claimData;
    }

    // Create the realtor user account
    const { data: newUser, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        email,
        role: 'realtor',
        verified_at: new Date().toISOString(),
        is_subscribed: false,
        company_name: companyName || name,
        phone: phone || null
      })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    let leadCount = 0;
    
    if (isClaimSignup) {
      // Update the property to link it to the new user
      const { error: propertyError } = await supabaseAdmin
        .from('properties')
        .update({
          claimed_by_user_id: newUser.id,
          status: 'active'
        })
        .eq('id', propertyId);

      if (propertyError) {
        console.error('Error linking property to user:', propertyError);
        // Don't fail the whole process if this fails
      }

      // Update the claim status
      const { error: claimUpdateError } = await supabaseAdmin
        .from('property_claims')
        .update({
          claim_status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', claimId);

      if (claimUpdateError) {
        console.error('Error updating claim status:', claimUpdateError);
        // Don't fail the whole process if this fails
      }

      // Get lead count for the property
      const { data: leads } = await supabaseAdmin
        .from('leads')
        .select('id')
        .eq('property_id', propertyId);

      leadCount = leads?.length || 0;
    }

    const response = {
      success: true,
      message: 'Account created successfully!',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: name,
        role: newUser.role,
        isSubscribed: newUser.is_subscribed
      }
    };

    // Only include property info if this was a claim-based signup
    if (isClaimSignup) {
      response.property = {
        id: propertyId,
        leadCount: leadCount
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    );
  }
}