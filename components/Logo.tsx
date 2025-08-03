import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'icon' | 'full' | 'stacked';
  href?: string;
  className?: string;
  showText?: boolean;
}

export default function Logo({ 
  size = 'md', 
  variant = 'full', 
  href = '/', 
  className = '',
  showText = true 
}: LogoProps) {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-sm',
      container: 'space-x-2'
    },
    md: {
      icon: 'w-8 h-8',
      text: 'text-lg',
      container: 'space-x-3'
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-xl',
      container: 'space-x-3'
    },
    xl: {
      icon: 'w-16 h-16',
      text: 'text-2xl',
      container: 'space-x-4'
    }
  };

  const sizes = sizeClasses[size];

  const IconComponent = () => (
    <div className={`${sizes.icon} bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg`}>
      <span className="text-white font-bold" style={{ fontSize: size === 'sm' ? '0.75rem' : size === 'md' ? '1rem' : size === 'lg' ? '1.5rem' : '2rem' }}>
        S
      </span>
    </div>
  );

  const TextComponent = () => (
    <span className={`${sizes.text} font-bold gradient-text`}>
      Scan for a Prize
    </span>
  );

  const LogoContent = () => {
    if (variant === 'icon') {
      return <IconComponent />;
    }

    if (variant === 'stacked') {
      return (
        <div className="flex flex-col items-center space-y-2">
          <IconComponent />
          {showText && <TextComponent />}
        </div>
      );
    }

    // Full variant (default)
    return (
      <div className={`flex items-center ${sizes.container}`}>
        <IconComponent />
        {showText && <TextComponent />}
      </div>
    );
  };

  if (!href) {
    return (
      <div className={`inline-flex ${className}`}>
        <LogoContent />
      </div>
    );
  }

  return (
    <Link 
      href={href} 
      className={`inline-flex hover:opacity-80 transition-opacity duration-200 ${className}`}
    >
      <LogoContent />
    </Link>
  );
}

// Gradient text utility for the logo text
export const LogoText = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <span className={`bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent font-bold ${className}`}>
    {children}
  </span>
);