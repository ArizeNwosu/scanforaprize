import Layout from '@/components/Layout';
import Logo from '@/components/Logo';

export default function HomePage() {
  return (
    <Layout variant="landing">
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 -mt-16">
      <div className="w-full max-w-md mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg mb-6 animate-bounce-gentle">
              <span className="text-3xl">🏠</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-4">
              Scan for a Prize
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Transform yard signs into lead magnets with smart QR codes
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 animate-slide-up">
          <div className="glass p-6 rounded-xl hover-lift">
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Lead Capture</h3>
            <p className="text-sm text-gray-600">
              Interested buyers scan and instantly share their contact info
            </p>
          </div>
          
          <div className="glass p-6 rounded-xl hover-lift">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Smart Analytics</h3>
            <p className="text-sm text-gray-600">
              Track engagement and manage leads from your dashboard
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 animate-slide-up">
          <a 
            href="/claim" 
            className="btn btn-primary btn-lg w-full group relative overflow-hidden"
          >
            <span className="relative z-10">Claim Your Leads</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transform translate-x-0 group-hover:translate-x-full transition-transform duration-300"></div>
          </a>
          
          <a 
            href="/signup" 
            className="btn btn-outline btn-lg w-full hover:bg-green-50 hover:border-green-300 hover:text-green-700 transition-all duration-300"
          >
            <span className="mr-2">👨‍💼</span>
            Sign Up as Realtor
          </a>
          
          <a 
            href="/admin" 
            className="btn btn-ghost btn-lg w-full text-gray-600 hover:text-purple-700 hover:bg-purple-50 transition-all duration-300"
          >
            <span className="mr-2">⚙️</span>
            Admin Dashboard
          </a>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <a 
                href="/login" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium"
              >
                Log in
              </a>
              <span className="text-gray-400">•</span>
              <a 
                href="/admin?user=demo-realtor@example.com" 
                className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                Demo Mode
              </a>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>Free for first 10 leads • No credit card required</p>
              <p>Professional lead capture for modern realtors</p>
            </div>
          </div>
        </div>

      </div>
      </div>
    </Layout>
  )
}