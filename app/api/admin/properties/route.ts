import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateSlug, generateVerificationCode } from '@/lib/utils';

export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured. Please add Supabase credentials to .env.local' },
        { status: 503 }
      );
    }

    // Get user email from query parameter
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email') || 'admin@scanforaprize.com';

    // Get user to check their role
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('email', userEmail)
      .single();

    // Build query based on user role
    let query = supabaseAdmin
      .from('properties')
      .select(`
        id,
        slug,
        address,
        verification_code,
        claimed_by_user_id,
        created_at,
        prize_title,
        prize_description,
        prize_image_url,
        leads(count)
      `)
      .order('created_at', { ascending: false });

    // For realtors, only show their claimed properties
    if (user && user.role === 'realtor') {
      query = query.eq('claimed_by_user_id', user.id);
    }

    const { data: properties, error } = await query;

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const propertiesWithLeadCount = properties.map(property => ({
      id: property.id,
      slug: property.slug,
      address: property.address,
      verificationCode: property.verification_code,
      claimedByUserId: property.claimed_by_user_id,
      createdAt: property.created_at,
      prizeTitle: property.prize_title,
      prizeDescription: property.prize_description,
      prizeImageUrl: property.prize_image_url,
      _count: {
        leads: property.leads?.[0]?.count || 0
      }
    }));

    return NextResponse.json(propertiesWithLeadCount);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured. Please add Supabase credentials to .env.local' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const address = formData.get('address') as string;
    const prizeTitle = formData.get('prizeTitle') as string;
    const prizeDescription = formData.get('prizeDescription') as string;
    const prizeImage = formData.get('prizeImage') as File | null;
    const isMasterAdmin = formData.get('isMasterAdmin') === 'true';

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    let prizeImageUrl = null;

    // Upload prize image if provided
    if (prizeImage && prizeImage.size > 0) {
      try {
        const fileName = `${Date.now()}-${prizeImage.name}`;
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
          .from('prize-images')
          .upload(fileName, prizeImage, {
            contentType: prizeImage.type,
          });

        if (uploadError) {
          console.error('Error uploading prize image:', uploadError);
          // Continue without image rather than fail the whole request
        } else {
          const { data: { publicUrl } } = supabaseAdmin.storage
            .from('prize-images')
            .getPublicUrl(fileName);
          prizeImageUrl = publicUrl;
        }
      } catch (uploadError) {
        console.error('Error uploading prize image:', uploadError);
        // Continue without image rather than fail the whole request
      }
    }

    const slug = generateSlug();
    const verificationCode = generateVerificationCode();

    // Get master admin user ID if needed
    let masterAdminId = null;
    if (isMasterAdmin) {
      const { data: masterAdmin } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', 'admin@scanforaprize.com')
        .single();
      masterAdminId = masterAdmin?.id;
    }

    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .insert({
        slug,
        address,
        verification_code: verificationCode,
        prize_title: prizeTitle || null,
        prize_description: prizeDescription || null,
        prize_image_url: prizeImageUrl,
        status: isMasterAdmin ? 'unclaimed' : 'claimed',
        created_by_master_admin: isMasterAdmin,
        master_admin_id: masterAdminId,
        claimed_by_user_id: isMasterAdmin ? null : masterAdminId, // For demo, master admin claims own properties when not creating for prospecting
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      return NextResponse.json(
        { error: 'Failed to create property' },
        { status: 500 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}