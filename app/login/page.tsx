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
        // Store user email in localStorage for session management
        localStorage.setItem('userEmail', formData.email);
        
        // Redirect to admin dashboard
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
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 -mt-16">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6">
            <span className="text-2xl">🔑</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">
            Sign in to your Scan for a Prize account
          </p>
        </div>

        {/* Form Card */}
        <div className="glass p-8 rounded-2xl shadow-soft animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                placeholder="Enter your password"
              />
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
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-0 group-hover:translate-x-full transition-transform duration-300"></div>
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Alternative Actions */}
          <div className="space-y-4">
            <a 
              href="/signup" 
              className="btn btn-outline btn-lg w-full hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
            >
              <span className="mr-2">👨‍💼</span>
              Create New Account
            </a>
            
            <a 
              href="/claim" 
              className="btn btn-ghost btn-lg w-full text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition-all duration-300"
            >
              <span className="mr-2">🏠</span>
              Found a QR Code? Claim Your Leads
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="text-sm text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:support@scanforaprize.com" className="text-blue-600 hover:text-blue-800 transition-colors duration-200">
              support@scanforaprize.com
            </a>
          </p>
        </div>
      </div>
      </div>
    </Layout>
  );
}