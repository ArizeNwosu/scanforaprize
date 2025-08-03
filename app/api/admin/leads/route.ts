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

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let query = supabaseAdmin
      .from('leads')
      .select(`
        id,
        name,
        email,
        phone,
        created_at,
        properties!inner(
          id,
          address,
          slug,
          prize_title
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by property if specified
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data: leads, error, count } = await query;

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads' },
        { status: 500 }
      );
    }

    // Get total count for pagination
    const { count: totalCount } = await supabaseAdmin
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq(propertyId ? 'property_id' : 'id', propertyId || '');

    return NextResponse.json({
      leads: leads || [],
      totalCount: totalCount || 0,
      hasMore: (offset + limit) < (totalCount || 0)
    });

  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

// Export leads as CSV
export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Database not configured. Please add Supabase credentials to .env.local' },
        { status: 503 }
      );
    }

    const { propertyId, format = 'csv' } = await request.json();

    // Get all leads (no pagination for export)
    let query = supabaseAdmin
      .from('leads')
      .select(`
        id,
        name,
        email,
        phone,
        created_at,
        properties!inner(
          address,
          prize_title
        )
      `)
      .order('created_at', { ascending: false });

    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const { data: leads, error } = await query;

    if (error) {
      console.error('Error fetching leads for export:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads for export' },
        { status: 500 }
      );
    }

    if (format === 'csv') {
      // Generate CSV content
      const headers = ['Name', 'Email', 'Phone', 'Property', 'Prize', 'Date Submitted'];
      const csvRows = [
        headers.join(','),
        ...(leads || []).map(lead => [
          `"${lead.name}"`,
          `"${lead.email}"`,
          `"${lead.phone || ''}"`,
          `"${lead.properties?.address || ''}"`,
          `"${lead.properties?.prize_title || ''}"`,
          `"${new Date(lead.created_at).toLocaleDateString()}"`
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      
      return new Response(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="leads_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json({ leads: leads || [] });

  } catch (error) {
    console.error('Error exporting leads:', error);
    return NextResponse.json(
      { error: 'Failed to export leads' },
      { status: 500 }
    );
  }
}