'use client';

import { useState, useEffect } from 'react';
import PropertyForm from './PropertyForm';
import PropertyList from './PropertyList';
import LeadsList from './LeadsList';
import Layout from '@/components/Layout';

interface Property {
  id: string;
  slug: string;
  address: string;
  verificationCode: string;
  claimedByUserId: string | null;
  createdAt: Date;
  prizeTitle: string | null;
  prizeDescription: string | null;
  prizeImageUrl: string | null;
  _count: {
    leads: number;
  };
}

export default function AdminPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeProperty, setWelcomeProperty] = useState('');
  const [profileData, setProfileData] = useState<{
    email: string;
    role: string;
    isSubscribed: boolean;
    isMasterAdmin: boolean;
    companyName: string;
    totalLeads: number;
    subscriptionStatus: string;
    currentPeriodEnd: string | null;
  } | null>(null);

  const fetchProperties = async () => {
    try {
      // Get user email for API call
      const urlParams = new URLSearchParams(window.location.search);
      const userEmail = urlParams.get('user') || localStorage.getItem('userEmail') || 'admin@scanforaprize.com';
      
      const response = await fetch(`/api/admin/properties?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      } else if (response.status === 503) {
        const errorData = await response.json();
        console.log('Database not configured:', errorData.error);
        // Keep properties empty to show setup message
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      // For demo: get user email from URL params or default to master admin
      const urlParams = new URLSearchParams(window.location.search);
      const userEmail = urlParams.get('user') || localStorage.getItem('userEmail') || 'admin@scanforaprize.com';
      
      const response = await fetch(`/api/admin/profile?email=${encodeURIComponent(userEmail)}`);
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProperties();
    fetchProfile();
    
    // Check for welcome message
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('welcome') === 'true') {
      const property = urlParams.get('property');
      setShowWelcome(true);
      setWelcomeProperty(property || '');
      
      // Clear URL params after showing welcome
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, []);

  const handlePropertyAdded = () => {
    fetchProperties();
    fetchProfile(); // Refresh profile to update lead count
  };

  const handleSubscriptionAction = async (action: string) => {
    try {
      const response = await fetch('/api/admin/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        if (data.redirectUrl === '/admin') {
          fetchProfile(); // Refresh profile data
        } else if (data.redirectUrl) {
          window.open(data.redirectUrl, '_blank');
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error managing subscription');
    }
  };

  return (
    <Layout 
      variant="app" 
      userEmail={profileData?.email} 
      isMasterAdmin={profileData?.isMasterAdmin}
    >
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Message */}
        {showWelcome && (
          <div className="mb-8 glass p-6 rounded-2xl animate-slide-down">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-3xl">🎉</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-green-800 mb-2">Welcome to Scan for a Prize!</h2>
                  <p className="text-green-700 mb-3">
                    Your account has been created successfully and you now have access to your property dashboard.
                  </p>
                  {welcomeProperty && (
                    <p className="text-green-600 text-sm mb-3">
                      <strong>Property claimed:</strong> {welcomeProperty}
                    </p>
                  )}
                  <div className="space-y-1 text-sm text-green-600">
                    <p><strong>✅ Free Access:</strong> View up to 10 leads at no cost</p>
                    <p><strong>📈 Upgrade Available:</strong> Get unlimited leads with Pro subscription</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-green-600 hover:text-green-800 text-2xl transition-colors duration-200"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {profileData?.isMasterAdmin ? 'Master Admin Dashboard' : 'Realtor Dashboard'}
              </h1>
              <p className="text-gray-600 text-lg">
                {profileData?.isMasterAdmin 
                  ? 'Create prospecting addresses and manage realtor accounts'
                  : 'Manage your claimed properties and leads'
                }
              </p>
              
              {/* Navigation Tabs */}
              <div className="flex space-x-6 mt-6 border-b border-gray-200">
                <a
                  href="/admin"
                  className="text-blue-600 font-medium border-b-2 border-blue-600 pb-2 transition-colors duration-200"
                >
                  Dashboard
                </a>
                <a
                  href="/admin/leads"
                  className="text-gray-600 hover:text-blue-600 pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors duration-200"
                >
                  All Leads
                </a>
                <a
                  href="/admin/profile"
                  className="text-gray-600 hover:text-blue-600 pb-2 border-b-2 border-transparent hover:border-blue-600 transition-colors duration-200"
                >
                  Profile & Billing
                </a>
              </div>
            </div>
            
            {/* Account Overview Card */}
            {profileData && (
              <div className="glass p-6 rounded-2xl shadow-soft min-w-80 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Account Overview</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      profileData.isMasterAdmin
                        ? 'bg-purple-100 text-purple-800'
                        : profileData.isSubscribed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profileData.isMasterAdmin ? 'Master Admin' : profileData.isSubscribed ? 'Pro' : 'Free Plan'}
                    </span>
                    <a
                      href="/admin/profile"
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors duration-200"
                    >
                      Manage →
                    </a>
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{profileData.email}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Leads:</span>
                    <span className="font-medium">{profileData.totalLeads}</span>
                  </div>
                  
                  {!profileData.isMasterAdmin && !profileData.isSubscribed && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Free Plan Limit:</span>
                        <span className="font-medium">{profileData.totalLeads}/10 leads</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min((profileData.totalLeads / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {profileData.totalLeads >= 10 ? (
                        <button 
                          onClick={() => handleSubscriptionAction('upgrade')}
                          className="btn btn-primary btn-sm w-full"
                        >
                          Upgrade to Pro
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleSubscriptionAction('upgrade')}
                          className="btn btn-outline btn-sm w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                        >
                          Upgrade to Pro
                        </button>
                      )}
                    </div>
                  )}
                  
                  {!profileData.isMasterAdmin && profileData.isSubscribed && profileData.currentPeriodEnd && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-600">Next Billing:</span>
                        <span className="font-medium">
                          {new Date(profileData.currentPeriodEnd).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          onClick={() => handleSubscriptionAction('manage')}
                          className="btn btn-primary btn-sm"
                        >
                          Manage Billing
                        </button>
                        <button 
                          onClick={() => handleSubscriptionAction('cancel')}
                          className="btn btn-destructive btn-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Properties Section */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Property Form */}
            <div className="xl:col-span-1">
              <div className="glass p-6 rounded-2xl shadow-soft">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {profileData?.isMasterAdmin ? 'Create Prospecting Address' : 'Add New Property'}
                </h2>
                {profileData?.isMasterAdmin ? (
                  <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-sm text-purple-800">
                      <strong>Master Admin:</strong> Create addresses for prospecting. Place QR codes on yard signs, and realtors can claim them to see the first 10 leads for free.
                    </p>
                  </div>
                ) : null}
                <PropertyForm onPropertyAdded={handlePropertyAdded} isMasterAdmin={profileData?.isMasterAdmin || false} />
              </div>
            </div>

            {/* Property List */}
            <div className="xl:col-span-2">
              <div className="glass rounded-2xl shadow-soft overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <h2 className="text-xl font-bold text-gray-900">
                    Properties ({properties.length})
                  </h2>
                </div>
                {isLoading ? (
                  <div className="p-12 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading properties...</p>
                  </div>
                ) : (
                  <PropertyList properties={properties} onUpdate={fetchProperties} />
                )}
              </div>
            </div>
          </div>

          {/* Leads Section */}
          <div>
            <div className="glass rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Recent Leads
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      Latest leads from your QR code campaigns
                    </p>
                  </div>
                  <a
                    href="/admin/leads"
                    className="btn btn-primary btn-sm"
                  >
                    View All Leads →
                  </a>
                </div>
              </div>
              <div className="p-6">
                <LeadsList properties={properties} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}