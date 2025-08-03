import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import LeadForm from './LeadForm';

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="card-elevated p-8">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="heading-md text-red-600 mb-3">Service Unavailable</h1>
            <p className="text-body text-muted">Database not configured</p>
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
            <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 0v1m-2 0V6a2 2 0 00-2 0v1m2 0V9.5m0 0v-2A2 2 0 014 6v1m8 0V9.5m0 0H9m3 0h3" />
              </svg>
            </div>
            <h1 className="heading-lg mb-3">
              Interested in This Property?
            </h1>
            <p className="text-body text-muted mb-6">
              Enter your information below to receive more details and updates
            </p>
            
            {/* Prize Information */}
            {property.prize_title && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="heading-sm text-yellow-800">Special Offer</span>
                </div>
                <h2 className="font-semibold text-yellow-900 mb-2">
                  {property.prize_title}
                </h2>
                {property.prize_description && (
                  <p className="text-sm text-yellow-800 mb-3">
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
            
            {/* Property Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-small text-muted mb-1">Property Address</p>
              <p className="font-medium text-gray-900">{property.address}</p>
            </div>
          </div>
          
          <LeadForm propertyId={property.id} />
        </div>
      </div>
    </div>
  );
}