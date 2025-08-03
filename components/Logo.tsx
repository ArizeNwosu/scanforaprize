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
      icon: 'w-10 h-10',
      text: 'text-xl',
      container: 'space-x-3'
    },
    xl: {
      icon: 'w-12 h-12',
      text: 'text-2xl',
      container: 'space-x-4'
    }
  };

  const sizes = sizeClasses[size];

  const IconComponent = () => (
    <div className={`${sizes.icon} bg-blue-600 rounded-lg flex items-center justify-center`}>
      <svg className="w-1/2 h-1/2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    </div>
  );

  const TextComponent = () => (
    <span className={`${sizes.text} font-bold text-gray-900`}>
      ScanForAPrize
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