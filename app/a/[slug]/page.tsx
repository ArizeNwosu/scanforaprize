import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import LeadForm from './LeadForm';

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Service Unavailable</h1>
          <p className="text-red-500">Database not configured</p>
        </div>
      </div>
    );
  }

  const { data: property, error } = await supabaseAdmin
    .from('properties')
    .select('id, address, prize_title, prize_description, prize_image_url')
    .eq('slug', params.slug)
    .single();

  if (error || !property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎉 Scan for a Prize!
          </h1>
          <p className="text-gray-600 mb-4">
            Enter your information below for a chance to win exciting prizes!
          </p>
          
          {property.prize_title && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <h2 className="text-xl font-bold text-orange-800 mb-2">
                🏆 {property.prize_title}
              </h2>
              {property.prize_description && (
                <p className="text-sm text-orange-700 mb-3">
                  {property.prize_description}
                </p>
              )}
              {property.prize_image_url && (
                <img 
                  src={property.prize_image_url} 
                  alt={property.prize_title}
                  className="max-w-full h-32 object-cover rounded-lg mx-auto"
                />
              )}
            </div>
          )}
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Property:</strong> {property.address}
            </p>
          </div>
        </div>
        
        <LeadForm propertyId={property.id} />
      </div>
    </div>
  );
}