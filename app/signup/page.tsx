'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';

interface ClaimData {
  property: {
    id: string;
    address: string;
    slug: string;
    leadCount: number;
  };
  realtor: {
    email: string;
    name: string;
    phone: string;
  };
  claimId: string;
}

export default function SignupPage() {
  const searchParams = useSearchParams();
  const [claimData, setClaimData] = useState<ClaimData | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    companyName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const claimDataParam = searchParams.get('claimData');
    if (claimDataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(claimDataParam));
        setClaimData(data);
        setFormData(prev => ({
          ...prev,
          email: data.realtor.email,
          name: data.realtor.name,
          phone: data.realtor.phone || '',
        }));
      } catch (error) {
        console.error('Error parsing claim data:', error);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          claimId: claimData?.claimId,
          propertyId: claimData?.property.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userEmail', formData.email);
        
        if (claimData) {
          window.location.href = `/admin?welcome=true&property=${encodeURIComponent(claimData?.property.address || '')}&user=${encodeURIComponent(formData.email)}`;
        } else {
          window.location.href = `/admin?welcome=true&user=${encodeURIComponent(formData.email)}`;
        }
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (error) {
      setError('Error creating account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isClaimFlow = !!claimData;

  return (
    <Layout variant="landing" footerVariant="minimal">
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-responsive">
          <div className="max-w-lg mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-3">
                {isClaimFlow ? 'Complete Your Account Setup' : 'Create Your Professional Account'}
              </h1>
              <p className="text-body">
                {isClaimFlow 
                  ? 'Your property has been verified. Complete your account to access your dashboard.'
                  : 'Join real estate professionals using our lead capture system'
                }
              </p>
            </div>

            {/* Success Message for Claims */}
            {isClaimFlow && claimData && (
              <div className="alert alert-success mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <div className="font-medium mb-1">Property Successfully Verified</div>
                    <div className="text-sm">
                      <div><strong>Property:</strong> {claimData.property.address}</div>
                      <div><strong>Current Leads:</strong> {claimData.property.leadCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="card-elevated p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                      className={`input ${isClaimFlow ? 'bg-gray-50' : ''}`}
                      readOnly={isClaimFlow}
                      placeholder="your@email.com"
                    />
                    {isClaimFlow && (
                      <div className="form-help">
                        Email cannot be changed (used during verification)
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="companyName" className="form-label">
                      Company/Brokerage
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="input"
                      placeholder="e.g., Keller Williams"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">
                      Phone Number
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
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input"
                      placeholder="Create password"
                    />
                    <div className="form-help">
                      Minimum 6 characters
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="input"
                      placeholder="Confirm password"
                    />
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
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-small mb-4">
                  Already have an account?{' '}
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign in here
                  </a>
                </p>
                <p className="text-xs text-gray-400">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}