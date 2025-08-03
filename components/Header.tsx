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
      <header className="sticky top-0 z-50 glass border-b border-white/20">
        <div className="container-responsive">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo size="md" showText={true} className="hidden sm:flex" />
            <Logo size="md" variant="icon" className="sm:hidden" />

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/claim" className="nav-link">
                Claim Leads
              </Link>
              <Link href="/signup" className="nav-link">
                Sign Up
              </Link>
              <Link href="/login" className="nav-link">
                Log In
              </Link>
              <Link href="/admin" className="btn btn-primary btn-sm">
                Admin
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
            <div className="md:hidden py-4 border-t border-white/20 animate-slide-down">
              <nav className="flex flex-col space-y-3">
                <Link href="/claim" className="nav-link text-center">
                  Claim Leads
                </Link>
                <Link href="/signup" className="nav-link text-center">
                  Sign Up
                </Link>
                <Link href="/login" className="nav-link text-center">
                  Log In
                </Link>
                <Link href="/admin" className="btn btn-primary btn-sm mx-4">
                  Admin Dashboard
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
    <header className="sticky top-0 z-50 glass border-b border-white/20">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo size="md" href="/admin" showText={true} className="hidden sm:flex" />
          <Logo size="md" variant="icon" href="/admin" className="sm:hidden" />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/admin" className="nav-link">
              Dashboard
            </Link>
            <Link href="/admin/leads" className="nav-link">
              Leads
            </Link>
            <Link href="/admin/profile" className="nav-link">
              Profile
            </Link>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
              <div className="text-sm">
                <div className="font-medium text-gray-900">{userEmail}</div>
                <div className="text-gray-500 text-xs">
                  {isMasterAdmin ? 'Master Admin' : 'Realtor'}
                </div>
              </div>
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
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
          <div className="md:hidden py-4 border-t border-white/20 animate-slide-down">
            <nav className="flex flex-col space-y-3">
              <Link href="/admin" className="nav-link text-center">
                Dashboard
              </Link>
              <Link href="/admin/leads" className="nav-link text-center">
                Leads
              </Link>
              <Link href="/admin/profile" className="nav-link text-center">
                Profile
              </Link>
              <div className="pt-3 border-t border-gray-200 mx-4">
                <div className="text-center text-sm">
                  <div className="font-medium text-gray-900">{userEmail}</div>
                  <div className="text-gray-500 text-xs mb-3">
                    {isMasterAdmin ? 'Master Admin' : 'Realtor'}
                  </div>
                  <Link
                    href="/"
                    className="btn btn-ghost btn-sm"
                  >
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