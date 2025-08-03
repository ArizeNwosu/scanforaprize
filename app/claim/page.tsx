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
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h1 className="heading-lg mb-3">Claim Your Property Leads</h1>
              <p className="text-body text-muted">
                Access leads collected from your QR code campaigns
              </p>
            </div>

            {/* Form Card */}
            <div className="card-elevated p-8 animate-slide-up">
              {step === 1 && (
                <div>
                  <div className="mb-6">
                    <h2 className="heading-sm mb-2">Step 1: Verify Property</h2>
                    <p className="text-small text-muted">
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
                    <h2 className="heading-sm mb-2">Step 2: Claim Access</h2>
                    <p className="text-small text-muted">
                      Complete your information and enter the verification code
                    </p>
                  </div>
                  
                  <form onSubmit={handleClaimSubmit} className="space-y-6">
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
                        placeholder="Enter your full name"
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
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">
                        Phone Number <span className="text-muted">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="input"
                        placeholder="Enter your phone number"
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
                          'Claim Property'
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn btn-text btn-base w-full"
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
              <p className="text-small text-muted">
                Need help? Contact us at{' '}
                <a href="mailto:support@scanforaprize.com" className="text-blue-600 hover:text-blue-700">
                  support@scanforaprize.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}