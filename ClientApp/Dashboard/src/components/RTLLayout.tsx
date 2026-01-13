import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from '../hooks/useTranslation';

interface RTLLayoutProps {
  children: React.ReactNode;
  className?: string;
  enableAutoDetection?: boolean;
  enableLayoutMirroring?: boolean;
}

export const RTLLayout: React.FC<RTLLayoutProps> = ({ 
  children, 
  className = '',
  enableAutoDetection = true,
  enableLayoutMirroring = true
}) => {
  const { isRTL, currentLanguage } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [layoutDirection, setLayoutDirection] = useState<'ltr' | 'rtl'>('ltr');

  // Ensure component is mounted before applying RTL styles to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Enhanced automatic RTL detection for Arabic languages
  const detectRTL = useCallback((language: string): boolean => {
    if (!enableAutoDetection) return false;
    
    // Arabic language variants that require RTL
    const rtlLanguages = ['ar', 'ar-EG', 'ar-AE', 'ar-SA', 'ar-MA', 'ar-DZ', 'ar-TN', 'ar-LY', 'ar-SD', 'ar-SY', 'ar-IQ', 'ar-JO', 'ar-LB', 'ar-KW', 'ar-BH', 'ar-QA', 'ar-OM', 'ar-YE'];
    
    // Check if language starts with Arabic code or is in RTL languages list
    return rtlLanguages.some(rtlLang => 
      language === rtlLang || language.startsWith(`${rtlLang}-`)
    );
  }, [enableAutoDetection]);

  // Update layout direction when language changes
  useEffect(() => {
    if (mounted) {
      const detectedRTL = detectRTL(currentLanguage);
      const direction = detectedRTL ? 'rtl' : 'ltr';
      
      setLayoutDirection(direction);
      
      // Update document direction and language
      document.documentElement.dir = direction;
      document.documentElement.lang = currentLanguage;
      
      // Add RTL/LTR classes to document element for CSS targeting
      document.documentElement.classList.remove('rtl', 'ltr');
      document.documentElement.classList.add(direction);
      
      // Add RTL/LTR classes to body for global styling
      document.body.classList.remove('rtl', 'ltr');
      document.body.classList.add(direction);
      
      // Set CSS custom property for direction-aware styling
      document.documentElement.style.setProperty('--text-direction', direction);
      document.documentElement.style.setProperty('--layout-direction', direction);
      
      // Apply layout mirroring if enabled
      if (enableLayoutMirroring) {
        applyLayoutMirroring(detectedRTL);
      }
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('rtlLayoutChange', {
        detail: {
          isRTL: detectedRTL,
          direction,
          language: currentLanguage,
          layoutMirroring: enableLayoutMirroring
        }
      }));
    }
  }, [currentLanguage, mounted, detectRTL, enableLayoutMirroring]);

  // Apply layout mirroring for RTL languages
  const applyLayoutMirroring = useCallback((isRightToLeft: boolean) => {
    const root = document.documentElement;
    
    if (isRightToLeft) {
      // Apply RTL-specific CSS custom properties
      root.style.setProperty('--flex-direction', 'row-reverse');
      root.style.setProperty('--text-align', 'right');
      root.style.setProperty('--border-radius-start', 'var(--border-radius-right)');
      root.style.setProperty('--border-radius-end', 'var(--border-radius-left)');
      root.style.setProperty('--margin-start', 'var(--margin-right)');
      root.style.setProperty('--margin-end', 'var(--margin-left)');
      root.style.setProperty('--padding-start', 'var(--padding-right)');
      root.style.setProperty('--padding-end', 'var(--padding-left)');
      
      // Add RTL-specific data attribute for CSS targeting
      root.setAttribute('data-layout-direction', 'rtl');
    } else {
      // Apply LTR-specific CSS custom properties
      root.style.setProperty('--flex-direction', 'row');
      root.style.setProperty('--text-align', 'left');
      root.style.setProperty('--border-radius-start', 'var(--border-radius-left)');
      root.style.setProperty('--border-radius-end', 'var(--border-radius-right)');
      root.style.setProperty('--margin-start', 'var(--margin-left)');
      root.style.setProperty('--margin-end', 'var(--margin-right)');
      root.style.setProperty('--padding-start', 'var(--padding-left)');
      root.style.setProperty('--padding-end', 'var(--padding-right)');
      
      // Add LTR-specific data attribute for CSS targeting
      root.setAttribute('data-layout-direction', 'ltr');
    }
  }, []);

  // Handle browser language detection on mount
  useEffect(() => {
    if (mounted && enableAutoDetection) {
      // Check if browser language should trigger RTL
      const browserLanguage = navigator.language || navigator.languages?.[0];
      if (browserLanguage && detectRTL(browserLanguage) && !currentLanguage) {
        // Only auto-detect if no language is currently set
        console.info('Auto-detected RTL language from browser:', browserLanguage);
      }
    }
  }, [mounted, enableAutoDetection, detectRTL, currentLanguage]);

  if (!mounted) {
    // Return a placeholder during SSR/initial render to prevent flash
    return (
      <div className={`min-h-screen ${className}`}>
        {children}
      </div>
    );
  }

  // Enhanced className generation with RTL-aware utilities
  const getLayoutClasses = () => {
    const baseClasses = ['min-h-screen'];
    
    // Add direction classes
    baseClasses.push(layoutDirection);
    
    // Add RTL-specific classes
    if (layoutDirection === 'rtl') {
      baseClasses.push(
        'rtl-layout',
        'text-right',
        '[&_.sidebar]:right-0',
        '[&_.sidebar]:left-auto',
        '[&_.dropdown]:right-0',
        '[&_.dropdown]:left-auto'
      );
    } else {
      baseClasses.push(
        'ltr-layout',
        'text-left',
        '[&_.sidebar]:left-0',
        '[&_.sidebar]:right-auto',
        '[&_.dropdown]:left-0',
        '[&_.dropdown]:right-auto'
      );
    }
    
    // Add custom className
    if (className) {
      baseClasses.push(className);
    }
    
    return baseClasses.join(' ');
  };

  return (
    <div 
      className={getLayoutClasses()}
      dir={layoutDirection}
      lang={currentLanguage}
      data-rtl={layoutDirection === 'rtl'}
      data-language={currentLanguage}
      style={{
        '--current-direction': layoutDirection,
        '--is-rtl': layoutDirection === 'rtl' ? '1' : '0'
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

// RTL-aware error boundary for layout issues
interface RTLErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class RTLErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  RTLErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): RTLErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('RTL Layout Error:', error, errorInfo);
    
    // Reset to LTR if RTL causes issues
    document.documentElement.dir = 'ltr';
    document.body.classList.remove('rtl');
    document.body.classList.add('ltr');
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Layout Error Detected
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              There was an issue with the layout rendering. The page has been reset to default layout.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RTLLayout;