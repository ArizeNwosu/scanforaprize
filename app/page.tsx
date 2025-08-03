import Layout from '@/components/Layout';

export default function HomePage() {
  return (
    <Layout variant="landing">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-lg mb-8">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0H8v0z" />
                  </svg>
                </div>
                <h1 className="heading-xl mb-6 max-w-3xl mx-auto">
                  Professional Lead Capture for Real Estate
                </h1>
                <p className="text-body text-xl max-w-2xl mx-auto mb-8">
                  Transform your yard signs into powerful lead generation tools. Capture qualified buyer interest instantly with QR code technology.
                </p>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="grid md:grid-cols-3 gap-8 mb-16 animate-slide-up">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-3">Instant Lead Capture</h3>
                <p className="text-small text-muted">
                  Buyers scan QR codes and submit contact information directly from their mobile device
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-3">Professional Dashboard</h3>
                <p className="text-small text-muted">
                  Manage leads, track engagement, and export data from your centralized dashboard
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="heading-sm mb-3">Secure & Verified</h3>
                <p className="text-small text-muted">
                  Physical verification codes ensure only authorized agents access property leads
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center animate-slide-up">
              <h2 className="heading-lg mb-4">Get Started Today</h2>
              <p className="text-body mb-8 max-w-2xl mx-auto">
                Join professional realtors who are already capturing more qualified leads with our QR code system.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <a href="/claim" className="btn btn-primary btn-base flex-1">
                  Claim Your Leads
                </a>
                <a href="/signup" className="btn btn-secondary btn-base flex-1">
                  Create Account
                </a>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-small text-muted mb-4">
                  Already have an account?
                </p>
                <div className="flex justify-center gap-6 text-sm">
                  <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign In
                  </a>
                  <a href="/admin" className="text-gray-600 hover:text-gray-700">
                    Admin Dashboard
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 text-center">
              <p className="text-small text-muted mb-4">Trusted by real estate professionals</p>
              <div className="flex justify-center items-center gap-8 text-xs text-gray-400">
                <span>✓ First 10 leads free</span>
                <span>✓ No setup fees</span>
                <span>✓ Professional support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}