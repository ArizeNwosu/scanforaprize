import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Scan for a Prize - Real Estate Lead Capture',
  description: 'Modern QR code lead capture system for realtors. Generate QR codes for yard signs and capture interested buyers instantly.',
  keywords: 'real estate, QR codes, lead capture, realtors, property marketing, yard signs, lead generation',
  authors: [{ name: 'Scan for a Prize' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: '#3B82F6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Scan for a Prize',
  },
  openGraph: {
    title: 'Scan for a Prize - Real Estate Lead Capture',
    description: 'Transform your yard signs into powerful lead generation tools with smart QR codes',
    type: 'website',
    locale: 'en_US',
    siteName: 'Scan for a Prize',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scan for a Prize - Real Estate Lead Capture',
    description: 'Modern QR code lead capture system for realtors',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {children}
        </div>
      </body>
    </html>
  )
}