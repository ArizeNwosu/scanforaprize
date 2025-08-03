'use client';

import { useState, useEffect } from 'react';

interface ProfileData {
  email: string;
  isSubscribed: boolean;
  totalLeads: number;
  subscriptionStatus: string;
  currentPeriodEnd: string | null;
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ email: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setEditForm({ email: data.email });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setIsEditing(false);
        fetchProfile();
        alert('Profile updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setIsUpdating(false);
    }
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
          fetchProfile();
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

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Profile & Subscription
              </h1>
              <p className="text-gray-600">
                Manage your account settings and subscription
              </p>
            </div>
            <a
              href="/admin"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>

        {profileData && (
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={updateProfile}
                      disabled={isUpdating}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm({ email: profileData.email });
                      }}
                      disabled={isUpdating}
                      className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{profileData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Leads Collected:</span>
                    <span className="font-medium">{profileData.totalLeads}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Subscription Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Subscription</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Plan:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    profileData.isSubscribed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {profileData.isSubscribed ? 'Pro Plan' : 'Free Plan'}
                  </span>
                </div>

                {!profileData.isSubscribed && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Free Plan Limits</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Leads collected:</span>
                        <span className="font-medium">{profileData.totalLeads}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${Math.min((profileData.totalLeads / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      {profileData.totalLeads >= 10 && (
                        <p className="text-red-600 text-sm font-medium">
                          ⚠️ You've reached your free plan limit! Upgrade to continue collecting leads.
                        </p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <button
                        onClick={() => handleSubscriptionAction('upgrade')}
                        className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                          profileData.totalLeads >= 10
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Upgrade to Pro Plan
                      </button>
                    </div>
                  </div>
                )}

                {profileData.isSubscribed && (
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                    <h3 className="font-medium text-green-900 mb-2">Pro Plan Benefits</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✅ Unlimited lead collection</li>
                      <li>✅ Advanced analytics</li>
                      <li>✅ Priority support</li>
                      <li>✅ Custom branding options</li>
                    </ul>
                    
                    {profileData.currentPeriodEnd && (
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <div className="flex justify-between text-sm">
                          <span>Next billing date:</span>
                          <span className="font-medium">
                            {new Date(profileData.currentPeriodEnd).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleSubscriptionAction('manage')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
                      >
                        Manage Billing
                      </button>
                      <button
                        onClick={() => handleSubscriptionAction('cancel')}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded text-sm hover:bg-red-700 transition-colors"
                      >
                        Cancel Subscription
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Plan Comparison */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Comparison</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Free Plan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Up to 10 leads</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Basic QR code generation</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Email notifications</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-red-600 mr-2">✗</span>
                      <span>Advanced analytics</span>
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-bold text-gray-900">Free</div>
                </div>
                
                <div className="border border-blue-500 rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium text-blue-900 mb-3">Pro Plan</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Unlimited leads</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Advanced QR code customization</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Priority email support</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>Advanced analytics & reports</span>
                    </div>
                  </div>
                  <div className="mt-4 text-2xl font-bold text-blue-900">$29/month</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}