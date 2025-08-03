import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Property code is required' },
        { status: 400 }
      );
    }

    const { data: property, error } = await supabaseAdmin
      .from('properties')
      .select('address')
      .eq('slug', slug)
      .single();

    if (error || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      address: property.address 
    });
  } catch (error) {
    console.error('Error verifying property:', error);
    return NextResponse.json(
      { error: 'Failed to verify property' },
      { status: 500 }
    );
  }
}