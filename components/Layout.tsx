import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  variant?: 'landing' | 'app';
  userEmail?: string;
  isMasterAdmin?: boolean;
  footerVariant?: 'landing' | 'app' | 'minimal';
}

export default function Layout({ 
  children, 
  variant = 'landing', 
  userEmail, 
  isMasterAdmin,
  footerVariant 
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        variant={variant} 
        userEmail={userEmail} 
        isMasterAdmin={isMasterAdmin} 
      />
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer variant={footerVariant || variant} />
    </div>
  );
}