'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function ClaimPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    slug: '',
    email: '',
    name: '',
    phone: '',
    verificationCode: '',
  });
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
    <Layout variant="landing" footerVariant="minimal">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-3">Access Your Property Leads</h1>
              <p className="text-body">
                Enter your property code and verification details to access collected leads
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  1
                </div>
                <div className={`w-16 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  2
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="card-elevated p-8">
              {step === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="heading-sm mb-2">Step 1: Verify Property</h2>
                    <p className="text-small">
                      Enter the property code from your QR URL
                    </p>
                  </div>
                  
                  <form onSubmit={handleSlugSubmit} className="space-y-6">
                    <div className="form-group">
                      <label htmlFor="slug" className="form-label">
                        Property Code
                      </label>
                      <input
                        type="text"
                        id="slug"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="Enter property code"
                        className="input"
                      />
                      <div className="form-help">
                        Found in your QR URL: scanforaprize.com/a/[property-code]
                      </div>
                    </div>

                    {error && (
                      <div className="alert alert-error">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary btn-base w-full"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <div className="loading-spinner mr-2"></div>
                          Verifying...
                        </span>
                      ) : (
                        'Continue'
                      )}
                    </button>
                  </form>
                </div>
              )}

              {step === 2 && (
                <div>
                  <div className="mb-6">
                    <h2 className="heading-sm mb-2">Step 2: Complete Verification</h2>
                    <p className="text-small">
                      Enter your contact information and verification code
                    </p>
                  </div>
                  
                  <form onSubmit={handleClaimSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="input"
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="input"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Phone Number <span className="text-gray-400">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="verificationCode" className="form-label">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        id="verificationCode"
                        required
                        value={formData.verificationCode}
                        onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                        placeholder="Enter verification code"
                        className="input"
                      />
                      <div className="form-help">
                        This code was provided with the property information
                      </div>
                    </div>

                    {error && (
                      <div className="alert alert-error">
                        {error}
                      </div>
                    )}

                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary btn-base w-full"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center">
                            <div className="loading-spinner mr-2"></div>
                            Verifying...
                          </span>
                        ) : (
                          'Access Leads'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-ghost btn-base w-full"
                      >
                        Back to Step 1
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-8 text-center">
              <p className="text-small">
                Need assistance?{' '}
                <a href="mailto:support@scanforaprize.com" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}