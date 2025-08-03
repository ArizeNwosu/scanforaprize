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

    const { name, email, phone, propertyId } = await request.json();

    if (!name || !email || !propertyId) {
      return NextResponse.json(
        { error: 'Name, email, and property ID are required' },
        { status: 400 }
      );
    }

    // Get property information including prize details
    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('address, prize_title, prize_description, prize_image_url')
      .eq('id', propertyId)
      .single();

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Create the lead
    const { data: lead, error } = await supabaseAdmin
      .from('leads')
      .insert({
        name,
        email,
        phone: phone || null,
        property_id: propertyId,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating lead:', error);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    // Send prize email if there's a prize configured
    if (property.prize_title) {
      try {
        await sendPrizeEmail({
          name,
          email,
          propertyAddress: property.address,
          prizeTitle: property.prize_title,
          prizeDescription: property.prize_description,
          prizeImageUrl: property.prize_image_url,
        });
      } catch (emailError) {
        console.error('Error sending prize email:', emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

async function sendPrizeEmail({
  name,
  email,
  propertyAddress,
  prizeTitle,
  prizeDescription,
  prizeImageUrl,
}: {
  name: string;
  email: string;
  propertyAddress: string;
  prizeTitle: string;
  prizeDescription: string | null;
  prizeImageUrl: string | null;
}) {
  // For now, we'll create a simple email service
  // This would typically integrate with a service like Resend, SendGrid, etc.
  
  const emailContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>🏆 Prize Information - ${prizeTitle}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .prize-image { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏆 Congratulations ${name}!</h1>
      <p>You've entered to win: ${prizeTitle}</p>
    </div>
    <div class="content">
      <p>Thank you for your interest in the property at <strong>${propertyAddress}</strong>!</p>
      
      <h2>🎁 Prize Details</h2>
      <h3>${prizeTitle}</h3>
      
      ${prizeDescription ? `<p>${prizeDescription}</p>` : ''}
      
      ${prizeImageUrl ? `<img src="${prizeImageUrl}" alt="${prizeTitle}" class="prize-image">` : ''}
      
      <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p><strong>What happens next?</strong></p>
        <ul>
          <li>Your entry has been recorded</li>
          <li>Winners will be selected randomly</li>
          <li>If you win, we'll contact you via this email</li>
          <li>Keep an eye on your inbox!</li>
        </ul>
      </div>
      
      <p>Good luck! 🍀</p>
    </div>
    <div class="footer">
      <p>This email was sent from the Scan for a Prize lead capture system.</p>
    </div>
  </div>
</body>
</html>
  `;

  // Log the email content for now (in production, you'd send via email service)
  console.log('Prize email would be sent to:', email);
  console.log('Email content:', emailContent);
  
  // TODO: Integrate with actual email service like Resend
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'prizes@scanforaprize.com',
  //   to: email,
  //   subject: `🏆 Prize Information - ${prizeTitle}`,
  //   html: emailContent,
  // });
}