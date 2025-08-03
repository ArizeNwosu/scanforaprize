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
        <div className="container-responsive">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="heading-lg mb-3">Welcome Back</h1>
              <p className="text-body">
                Sign in to your professional dashboard
              </p>
            </div>

            {/* Form Card */}
            <div className="card-elevated p-8">
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
                    placeholder="your@email.com"
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
                  <span className="px-4 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Alternative Actions */}
              <div className="space-y-3">
                <a href="/signup" className="btn btn-secondary btn-base w-full">
                  Create New Account
                </a>
                
                <a href="/claim" className="btn btn-ghost btn-base w-full">
                  Found a QR Code? Access Your Leads
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-small">
                Need help?{' '}
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