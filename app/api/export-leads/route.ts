import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    if (property.claimed_by_user_id) {
      const { data: user, error: userError } = await supabaseAdmin
        .from('users')
        .select('is_subscribed')
        .eq('id', property.claimed_by_user_id)
        .single();

      if (userError || !user || !user.is_subscribed) {
        return NextResponse.json(
          { error: 'Subscription required for export' },
          { status: 403 }
        );
      }
    }

    const { data: propertyLeads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (leadsError) {
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    const csvHeaders = 'Name,Email,Phone,Submitted Date\n';
    const csvRows = propertyLeads.map(lead => {
      const submittedDate = new Date(lead.created_at).toLocaleString();
      const phone = lead.phone || '';
      return `"${lead.name}","${lead.email}","${phone}","${submittedDate}"`;
    }).join('\n');

    const csvContent = csvHeaders + csvRows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="leads-${property.address.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}