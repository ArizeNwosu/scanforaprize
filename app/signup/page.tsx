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
    // Get claim data from URL params or session storage
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
        // Store user email in localStorage for session management
        localStorage.setItem('userEmail', formData.email);
        
        // Redirect to admin dashboard with success message and user parameter
        if (isClaimFlow) {
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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 -mt-16">
      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg mb-6">
            <span className="text-2xl">{isClaimFlow ? '🎉' : '👋'}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isClaimFlow ? 'Property Verified!' : 'Create Your Realtor Account'}
          </h1>
          <p className="text-gray-600">
            {isClaimFlow 
              ? 'Create your account to access your dashboard and leads'
              : 'Join Scan for a Prize and start capturing leads with QR codes'
            }
          </p>
        </div>

        {/* Claim Success Message */}
        {isClaimFlow && claimData && (
          <div className="glass p-6 rounded-xl mb-6 animate-slide-up">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">✅</div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-800 mb-2">Property Successfully Claimed!</h3>
                <div className="space-y-1 text-sm text-green-700">
                  <p><strong>Property:</strong> {claimData.property.address}</p>
                  <p><strong>Current Leads:</strong> {claimData.property.leadCount} 
                    <span className="text-green-600"> (Free limit: 10 leads)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Features for New Users */}
        {!isClaimFlow && (
          <div className="glass p-6 rounded-xl mb-6 animate-slide-up">
            <h3 className="font-semibold text-blue-800 mb-3">What you get:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-700">
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Create properties and generate QR codes</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Capture leads from interested buyers</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>First 10 leads completely free</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✅</span>
                <span>Email notifications for new leads</span>
              </div>
              <div className="flex items-center space-x-2 sm:col-span-2">
                <span>✅</span>
                <span>Professional lead management dashboard</span>
              </div>
            </div>
          </div>
        )}

        {/* Form Card */}
        <div className="glass p-8 rounded-2xl shadow-soft animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                  className={`input w-full ${isClaimFlow ? 'bg-gray-50' : ''}`}
                  readOnly={isClaimFlow}
                  placeholder="Enter your email"
                />
                {isClaimFlow ? (
                  <p className="text-xs text-gray-500">
                    Email cannot be changed (used during claim process)
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    Use a valid email address - you'll receive lead notifications here
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                  Company/Brokerage Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="input w-full"
                  placeholder="e.g., Keller Williams, RE/MAX"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input w-full"
                  placeholder="Create a password"
                />
                <p className="text-xs text-gray-500">
                  Minimum 6 characters
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input w-full"
                  placeholder="Confirm your password"
                />
              </div>
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
                {isSubmitting ? 'Creating Account...' : isClaimFlow ? 'Create Account & Access Dashboard' : 'Create Realtor Account'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-0 group-hover:translate-x-full transition-transform duration-300"></div>
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Already have an account?{' '}
              <a href="/login" className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium">
                Log in here
              </a>
            </p>
            <p className="text-xs text-gray-500">
              By creating an account, you agree to our Terms of Service and Privacy Policy.
              You'll get immediate access to your first 10 leads for free!
            </p>
          </div>
        </div>
      </div>
      </div>
    </Layout>
  );
}