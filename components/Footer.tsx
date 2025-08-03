import Link from 'next/link';
import Logo from './Logo';

interface FooterProps {
  variant?: 'landing' | 'app' | 'minimal';
}

export default function Footer({ variant = 'landing' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  if (variant === 'minimal') {
    return (
      <footer className="mt-8 py-6 border-t border-gray-200">
        <div className="container-responsive">
          <div className="text-center text-sm text-gray-500 space-y-2">
            <p>&copy; {currentYear} Scan for a Prize. All rights reserved.</p>
            <div className="flex items-center justify-center space-x-4">
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  if (variant === 'app') {
    return (
      <footer className="mt-12 py-8 border-t border-gray-200 bg-gray-50">
        <div className="container-responsive">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="mb-4">
                <Logo size="md" href={null} />
              </div>
              <p className="text-sm text-gray-600 max-w-xs">
                Transform your real estate yard signs into powerful lead generation tools with smart QR codes.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
              <nav className="space-y-2">
                <Link href="/admin" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/leads" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Manage Leads
                </Link>
                <Link href="/admin/profile" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Profile & Billing
                </Link>
              </nav>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
              <nav className="space-y-2">
                <a href="mailto:support@scanforaprize.com" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Email Support
                </a>
                <Link href="/help" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Help Center
                </Link>
                <Link href="/privacy" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>
              </nav>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>&copy; {currentYear} Scan for a Prize. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }

  // Landing variant (default)
  return (
    <footer className="mt-16 py-12 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <div className="container-responsive">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <Logo size="lg" href={null} />
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Revolutionary QR code lead capture system designed specifically for modern real estate professionals.
            </p>
            
            {/* Social Media (placeholder) */}
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Product</h4>
            <nav className="space-y-3">
              <Link href="/signup" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Get Started
              </Link>
              <Link href="/claim" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Claim Leads
              </Link>
              <Link href="/pricing" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Pricing
              </Link>
              <Link href="/features" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Resources</h4>
            <nav className="space-y-3">
              <Link href="/help" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Help Center
              </Link>
              <Link href="/blog" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Blog
              </Link>
              <Link href="/case-studies" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Case Studies
              </Link>
              <Link href="/api-docs" className="block text-gray-600 hover:text-blue-600 transition-colors">
                API Documentation
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-6">Company</h4>
            <nav className="space-y-3">
              <Link href="/about" className="block text-gray-600 hover:text-blue-600 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </Link>
              <Link href="/careers" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Careers
              </Link>
              <Link href="/privacy" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-gray-600 hover:text-blue-600 transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {currentYear} Scan for a Prize. All rights reserved.
            </div>
            
            {/* Contact Info */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-sm text-gray-500">
              <a href="mailto:support@scanforaprize.com" className="hover:text-blue-600 transition-colors">
                support@scanforaprize.com
              </a>
              <a href="tel:+1-555-123-4567" className="hover:text-blue-600 transition-colors">
                +1 (555) 123-4567
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}