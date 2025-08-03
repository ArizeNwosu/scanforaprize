import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'png'; // png or svg
    const size = parseInt(searchParams.get('size') || '300');
    
    // Generate the QR code URL (same as what users scan)
    const qrUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/a/${params.slug}`;
    
    if (format === 'svg') {
      // Generate SVG QR code
      const qrSvg = await QRCode.toString(qrUrl, {
        type: 'svg',
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      return new Response(qrSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Content-Disposition': `attachment; filename="qr-code-${params.slug}.svg"`
        }
      });
    } else {
      // Generate PNG QR code (default)
      const qrBuffer = await QRCode.toBuffer(qrUrl, {
        type: 'png',
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });

      return new Response(qrBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="qr-code-${params.slug}.png"`
        }
      });
    }
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

// Generate QR code as base64 data URL for inline display
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { size = 300 } = await request.json();
    
    const qrUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/a/${params.slug}`;
    
    // Generate base64 data URL for inline display
    const qrDataUrl = await QRCode.toDataURL(qrUrl, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });

    return NextResponse.json({ 
      dataUrl: qrDataUrl,
      url: qrUrl,
      slug: params.slug
    });
  } catch (error) {
    console.error('Error generating QR code data URL:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}