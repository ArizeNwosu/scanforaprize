'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userEmail', formData.email);
        window.location.href = `/admin?user=${encodeURIComponent(formData.email)}`;
      } else {
        setError(data.error || 'Failed to log in');
      }
    } catch (error) {
      setError('Error logging in. Please try again.');
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <h1 className="heading-lg mb-3">Welcome Back</h1>
              <p className="text-body text-muted">
                Sign in to your professional dashboard
              </p>
            </div>

            {/* Form Card */}
            <div className="card-elevated p-8 animate-slide-up">
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    placeholder="Enter your password"
                  />
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
                      Signing In...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-muted">or</span>
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="space-y-3">
                <a href="/signup" className="btn btn-secondary btn-base w-full">
                  Create New Account
                </a>
                
                <a href="/claim" className="btn btn-text btn-base w-full">
                  Found a QR Code? Claim Your Leads
                </a>
              </div>
            </div>

            {/* Footer */}
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