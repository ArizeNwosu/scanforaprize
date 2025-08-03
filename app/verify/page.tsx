import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';

export default async function VerifyPage({ 
  searchParams 
}: { 
  searchParams: { token?: string } 
}) {
  const { token } = searchParams;

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Link</h1>
          <p className="text-gray-600">The verification link is invalid or missing.</p>
        </div>
      </div>
    );
  }

  try {
    const { data: verificationToken, error: tokenError } = await supabaseAdmin
      .from('verification_tokens')
      .select('*')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !verificationToken) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Link Expired</h1>
            <p className="text-gray-600">The verification link has expired or is invalid.</p>
            <a 
              href="/claim" 
              className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Try Again
            </a>
          </div>
        </div>
      );
    }

    // Update user as verified
    await supabaseAdmin
      .from('users')
      .update({ verified_at: new Date().toISOString() })
      .eq('id', verificationToken.user_id);

    // Update property as claimed
    await supabaseAdmin
      .from('properties')
      .update({ claimed_by_user_id: verificationToken.user_id })
      .eq('id', verificationToken.property_id);

    // Delete the verification token
    await supabaseAdmin
      .from('verification_tokens')
      .delete()
      .eq('id', verificationToken.id);

    redirect(`/dashboard?propertyId=${verificationToken.property_id}&userId=${verificationToken.user_id}`);
  } catch (error) {
    console.error('Verification error:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
          <p className="text-gray-600">There was an error verifying your email. Please try again.</p>
        </div>
      </div>
    );
  }
}