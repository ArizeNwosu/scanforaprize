'use client';

import { useState } from 'react';

export default function ClaimPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    slug: '',
    email: '',
    name: '',
    phone: '',
    verificationCode: '',
  });
  const [claimResult, setClaimResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSlugSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/verify-property', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: formData.slug }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep(2);
      } else {
        setError(data.error || 'Property not found');
      }
    } catch (error) {
      setError('Error verifying property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertySlug: formData.slug,
          verificationCode: formData.verificationCode,
          realtorEmail: formData.email,
          realtorName: formData.name,
          realtorPhone: formData.phone
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to signup page with claim data
        const claimDataParam = encodeURIComponent(JSON.stringify(data));
        window.location.href = `/signup?claimData=${claimDataParam}`;
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch (error) {
      setError('Error claiming property. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <span className="text-2xl">🏠</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Claim Your Leads
          </h1>
          <p className="text-gray-600">
            Unlock leads from your QR code campaigns
          </p>
        </div>

        {/* Form Card */}
        <div className="glass p-8 rounded-2xl shadow-soft animate-slide-up">
          {step === 1 && (
            <div>
              <p className="text-gray-600 mb-6 text-center">
                Enter the property code from your QR URL to get started.
              </p>
              
              <form onSubmit={handleSlugSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                    Property Code
                  </label>
                  <input
                    type="text"
                    id="slug"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g., dKf92WnX93..."
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-500">
                    This is the long code from your QR URL: scanforaprize.com/a/[code]
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-scale-in">
                    <div className="flex items-center">
                      <span className="mr-2">⚠️</span>
                      {error}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg w-full group relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Verifying...' : 'Continue'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-0 group-hover:translate-x-full transition-transform duration-300"></div>
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-gray-600 mb-6 text-center">
                Enter your information and the verification code to claim this property.
              </p>
              
              <form onSubmit={handleClaimSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input w-full"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input w-full"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input w-full"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="verificationCode"
                    required
                    value={formData.verificationCode}
                    onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                    placeholder="e.g., XT7-82C4"
                    className="input w-full"
                  />
                  <p className="text-xs text-gray-500">
                    This code was printed on the slip left inside the property
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-scale-in">
                    <div className="flex items-center">
                      <span className="mr-2">⚠️</span>
                      {error}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-lg w-full group relative overflow-hidden"
                >
                  <span className="relative z-10">
                    {isSubmitting ? 'Verifying...' : 'Claim Property'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-0 group-hover:translate-x-full transition-transform duration-300"></div>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn btn-outline btn-lg w-full"
                >
                  Back
                </button>
              </form>
            </div>
          )}

          {step === 3 && claimResult && (
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-gentle">🎉</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                Property Claimed Successfully!
              </h2>
              <div className="glass p-6 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mb-6">
                <div className="space-y-3 text-sm text-green-800">
                  <p><strong>Property:</strong> {claimResult.property.address}</p>
                  <p><strong>Current Leads:</strong> {claimResult.property.leadCount} 
                    {claimResult.property.leadCount >= 10 ? (
                      <span className="text-orange-600 font-medium"> (Upgrade needed for more)</span>
                    ) : (
                      <span className="text-green-600"> (Free limit: 10 leads)</span>
                    )}
                  </p>
                  {claimResult.realtor.isNewUser && (
                    <p><strong>Account created!</strong> You can now access your admin dashboard.</p>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <a
                  href="/admin"
                  className="btn btn-primary btn-lg w-full group relative overflow-hidden"
                >
                  <span className="relative z-10">Access Your Dashboard</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-0 group-hover:translate-x-full transition-transform duration-300"></div>
                </a>
                <p className="text-sm text-gray-600">
                  You now have access to view and manage leads for this property.
                  {claimResult.property.leadCount >= 10 && (
                    <span className="block mt-2 text-orange-600 font-medium">
                      Upgrade to Pro to capture unlimited leads!
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}