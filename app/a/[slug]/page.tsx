import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import LeadForm from './LeadForm';

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="card-elevated p-8">
            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="heading-md text-red-600 mb-3">Service Unavailable</h1>
            <p className="text-body">Database not configured</p>
          </div>
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="card-elevated p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h1 className="heading-lg mb-3">
              Interested in This Property?
            </h1>
            <p className="text-body mb-6">
              Get more information and updates about this listing
            </p>
            
            {/* Property Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-small text-gray-500 mb-1">Property Address</p>
              <p className="font-medium text-gray-900">{property.address}</p>
            </div>

            {/* Prize Information */}
            {property.prize_title && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  <span className="heading-sm text-blue-800">Special Offer</span>
                </div>
                <h2 className="font-semibold text-blue-900 mb-2">
                  {property.prize_title}
                </h2>
                {property.prize_description && (
                  <p className="text-sm text-blue-800 mb-3">
                    {property.prize_description}
                  </p>
                )}
                {property.prize_image_url && (
                  <img 
                    src={property.prize_image_url} 
                    alt={property.prize_title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            )}
          </div>
          
          <LeadForm propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}