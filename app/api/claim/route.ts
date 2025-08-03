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

    const { propertySlug, verificationCode, realtorEmail, realtorName, realtorPhone } = await request.json();

    if (!propertySlug || !verificationCode || !realtorEmail || !realtorName) {
      return NextResponse.json(
        { error: 'Property code, verification code, email, and name are required' },
        { status: 400 }
      );
    }

    // Find the property
    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('slug', propertySlug)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check if property is available for claiming
    if (property.status !== 'unclaimed') {
      return NextResponse.json(
        { error: 'This property has already been claimed' },
        { status: 400 }
      );
    }

    // Verify the verification code
    if (property.verification_code !== verificationCode) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if realtor already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', realtorEmail)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in to your existing account.' },
        { status: 400 }
      );
    }

    // Create property claim record
    const { data: claim, error: claimError } = await supabaseAdmin
      .from('property_claims')
      .insert({
        property_id: property.id,
        realtor_email: realtorEmail,
        realtor_name: realtorName,
        realtor_phone: realtorPhone,
        verification_code_entered: verificationCode,
        claim_status: 'approved', // Auto-approve for demo
        approved_at: new Date().toISOString()
      })
      .select()
      .single();

    if (claimError) {
      console.error('Error creating claim:', claimError);
      return NextResponse.json(
        { error: 'Failed to create claim' },
        { status: 500 }
      );
    }

    // Mark property as reserved (not fully claimed until account creation)
    const { error: updateError } = await supabaseAdmin
      .from('properties')
      .update({
        status: 'claimed', // Reserve the property
        claimed_at: new Date().toISOString()
        // Don't set claimed_by_user_id until account is created
      })
      .eq('id', property.id);

    if (updateError) {
      console.error('Error updating property:', updateError);
      return NextResponse.json(
        { error: 'Failed to claim property' },
        { status: 500 }
      );
    }

    // Get current lead count for this property
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('property_id', property.id);

    const leadCount = leads?.length || 0;

    return NextResponse.json({
      success: true,
      message: 'Property verified successfully!',
      property: {
        id: property.id,
        address: property.address,
        slug: property.slug,
        leadCount: leadCount
      },
      realtor: {
        email: realtorEmail,
        name: realtorName,
        phone: realtorPhone
      },
      claimId: claim.id
    });

  } catch (error) {
    console.error('Error processing claim:', error);
    return NextResponse.json(
      { error: 'Failed to process claim' },
      { status: 500 }
    );
  }
}