import { supabaseAdmin } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import LeadsList from './LeadsList';
import UpgradeButton from './UpgradeButton';

export default async function DashboardPage({ 
  searchParams 
}: { 
  searchParams: { propertyId?: string; userId?: string } 
}) {
  const { propertyId, userId } = searchParams;

  if (!propertyId || !userId) {
    redirect('/claim');
  }

  try {
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError || !user || !user.verified_at) {
      redirect('/claim');
    }

    const { data: property, error: propertyError } = await supabaseAdmin
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .eq('claimed_by_user_id', userId)
      .single();

    if (propertyError || !property) {
      redirect('/claim');
    }

    const { data: allLeads, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });

    if (leadsError) {
      console.error('Error fetching leads:', leadsError);
      redirect('/claim');
    }

    const isSubscribed = user.is_subscribed;
    const freeLeadsLimit = 10;
    const visibleLeads = isSubscribed ? allLeads : allLeads.slice(0, freeLeadsLimit);
    const hasMoreLeads = allLeads.length > freeLeadsLimit;

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Property Leads Dashboard
            </h1>
            <p className="text-gray-600 mb-4">
              <strong>Property:</strong> {property[0].address}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900">Total Leads</h3>
                <p className="text-3xl font-bold text-blue-600">{allLeads.length}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900">Accessible Leads</h3>
                <p className="text-3xl font-bold text-green-600">{visibleLeads.length}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-900">Plan Status</h3>
                <p className="text-lg font-bold text-purple-600">
                  {isSubscribed ? 'Premium' : 'Free'}
                </p>
              </div>
            </div>
          </div>

          {!isSubscribed && hasMoreLeads && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-orange-900 mb-2">
                🔒 Unlock All Your Leads
              </h2>
              <p className="text-orange-800 mb-4">
                You have {allLeads.length} total leads, but can only view {freeLeadsLimit} on the free plan. 
                Upgrade to access all leads and continue collecting new ones.
              </p>
              <UpgradeButton userId={userId} propertyId={propertyId} />
            </div>
          )}

          <LeadsList 
            leads={visibleLeads} 
            isSubscribed={isSubscribed}
            propertyId={propertyId}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard error:', error);
    redirect('/claim');
  }
}