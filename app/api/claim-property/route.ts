import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateToken } from '@/lib/utils';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { slug, email, verificationCode } = await request.json();

    if (!slug || !email || !verificationCode) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Check if property exists and verification code matches
    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('id, verification_code')
      .eq('slug', slug)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.verification_code !== verificationCode) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Check if user exists, create if not
    let { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (userError && userError.code === 'PGRST116') {
      // User doesn't exist, create new user
      const { data: newUser, error: createUserError } = await supabaseAdmin
        .from('users')
        .insert({ email })
        .select('id')
        .single();

      if (createUserError) {
        console.error('Error creating user:', createUserError);
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        );
      }
      user = newUser;
    } else if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Failed to fetch user' },
        { status: 500 }
      );
    }

    // Create verification token
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .insert({
        token,
        user_id: user!.id,
        property_id: property.id,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Error creating verification token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create verification token' },
        { status: 500 }
      );
    }

    await sendVerificationEmail(email, token);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error claiming property:', error);
    return NextResponse.json(
      { error: 'Failed to claim property' },
      { status: 500 }
    );
  }
}