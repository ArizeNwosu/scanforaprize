import Layout from '@/components/Layout';

export default function HomePage() {
  return (
    <Layout variant="landing">
      <div className="bg-white">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
          <div className="container-responsive">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="heading-xl mb-6">
                Professional Lead Capture for Real Estate
              </h1>
              <p className="text-lead mb-8 max-w-2xl mx-auto">
                Transform your yard signs into powerful lead generation tools. 
                Capture qualified buyer interest instantly with QR code technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <a href="/claim" className="btn btn-primary btn-lg flex-1">
                  Access Your Leads
                </a>
                <a href="/signup" className="btn btn-secondary btn-lg flex-1">
                  Get Started
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding">
          <div className="container-responsive">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="heading-lg mb-4">
                  Everything You Need to Capture More Leads
                </h2>
                <p className="text-lead max-w-2xl mx-auto">
                  Professional tools designed specifically for real estate agents
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="heading-sm mb-4">Instant Lead Capture</h3>
                  <p className="text-body">
                    Buyers scan QR codes and submit contact information directly from their mobile device
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="heading-sm mb-4">Professional Dashboard</h3>
                  <p className="text-body">
                    Manage leads, track engagement, and export data from your centralized dashboard
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="heading-sm mb-4">Secure & Verified</h3>
                  <p className="text-body">
                    Physical verification codes ensure only authorized agents access property leads
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-responsive">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="heading-lg mb-4">
                Ready to Capture More Qualified Leads?
              </h2>
              <p className="text-lead mb-8">
                Join professional realtors who are already generating more business with our QR code system
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-12">
                <a href="/claim" className="btn btn-primary btn-lg flex-1">
                  Claim Your Leads
                </a>
                <a href="/signup" className="btn btn-outline btn-lg flex-1">
                  Create Account
                </a>
              </div>
              
              <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  First 10 leads free
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  No setup fees
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Professional support
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}