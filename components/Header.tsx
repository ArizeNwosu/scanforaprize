'use client';

import { useState } from 'react';
import Link from 'next/link';
import Logo from './Logo';

interface HeaderProps {
  variant?: 'landing' | 'app';
  userEmail?: string;
  isMasterAdmin?: boolean;
}

export default function Header({ variant = 'landing', userEmail, isMasterAdmin }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  if (variant === 'landing') {
    return (
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="md" showText={true} className="hidden sm:flex" />
            <Logo size="md" variant="icon" className="sm:hidden" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/claim" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Access Leads
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <Link href="/claim" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2">
                  Access Leads
                </Link>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2">
                  Sign In
                </Link>
                <Link href="/signup" className="btn btn-primary btn-base">
                  Get Started
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    );
  }

  // App variant for authenticated pages
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" href="/admin" showText={true} className="hidden sm:flex" />
          <Logo size="md" variant="icon" href="/admin" className="sm:hidden" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/leads" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Leads
            </Link>
            <Link href="/admin/profile" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Profile
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{userEmail}</div>
                <div className="text-xs text-gray-500">
                  {isMasterAdmin ? 'Master Admin' : 'Realtor'}
                </div>
              </div>
              <Link
                href="/"
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Sign Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link href="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2">
                Dashboard
              </Link>
              <Link href="/admin/leads" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2">
                Leads
              </Link>
              <Link href="/admin/profile" className="text-gray-600 hover:text-blue-600 font-medium transition-colors py-2">
                Profile
              </Link>
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <div className="font-medium text-gray-900 mb-1">{userEmail}</div>
                  <div className="text-xs text-gray-500 mb-4">
                    {isMasterAdmin ? 'Master Admin' : 'Realtor'}
                  </div>
                  <Link href="/" className="btn btn-ghost btn-sm">
                    Sign Out
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}