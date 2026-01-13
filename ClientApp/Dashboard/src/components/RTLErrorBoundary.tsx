import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Bug, Info } from 'lucide-react';

interface RTLErrorBoundaryProps {
  children: ReactNode;
  fallbackToLTR?: boolean;
  showErrorDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  customFallback?: ReactNode;
  resetOnLanguageChange?: boolean;
}

interface RTLErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isRTL: boolean;
  originalDirection: string;
  retryCount: number;
}

class RTLErrorBoundary extends Component<RTLErrorBoundaryProps, RTLErrorBoundaryState> {
  private retryTimeoutId: number | null = null;

  constructor(props: RTLErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isRTL: document.documentElement.dir === 'rtl',
      originalDirection: document.documentElement.dir || 'ltr',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<RTLErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('RTL Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      errorInfo
    });

    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // If fallbackToLTR is enabled and we're in RTL mode, switch to LTR
    if (this.props.fallbackToLTR && this.state.isRTL) {
      document.documentElement.dir = 'ltr';
      document.body.classList.remove('rtl');
      document.body.classList.add('ltr');
    }
  }

  componentDidUpdate() {
    // Reset error boundary when language changes if resetOnLanguageChange is enabled
    if (this.props.resetOnLanguageChange && this.state.hasError) {
      const currentDir = document.documentElement.dir;
      if (currentDir !== this.state.originalDirection) {
        this.handleRetry();
      }
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  handleRetry = () => {
    // Restore original direction if fallbackToLTR was used
    if (this.props.fallbackToLTR && this.state.originalDirection === 'rtl') {
      document.documentElement.dir = this.state.originalDirection;
      document.body.classList.remove('ltr');
      document.body.classList.add('rtl');
    }

    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.customFallback) {
        return this.props.customFallback;
      }

      const { isRTL } = this.state;
      const { showErrorDetails = false } = this.props;

      return (
        <div 
          className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {isRTL ? 'حدث خطأ غير متوقع' : 'Something went wrong'}
            </h1>

            {/* Error Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isRTL 
                ? 'نعتذر، حدث خطأ أثناء عرض هذه الصفحة. يرجى المحاولة مرة أخرى.'
                : 'Sorry, there was an error displaying this page. Please try again.'
              }
            </p>

            {/* Error Details (if enabled) */}
            {showErrorDetails && this.state.error && (
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg text-left">
                <div className="flex items-center gap-2 mb-2">
                  <Bug className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {isRTL ? 'تفاصيل الخطأ:' : 'Error Details:'}
                  </span>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                  <div className="mb-1">
                    <strong>{isRTL ? 'الرسالة:' : 'Message:'}</strong> {this.state.error.message}
                  </div>
                  {this.state.error.stack && (
                    <div>
                      <strong>{isRTL ? 'المكدس:' : 'Stack:'}</strong>
                      <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Retry Information */}
            {this.state.retryCount > 0 && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-center gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    {isRTL 
                      ? `عدد المحاولات: ${this.state.retryCount}`
                      : `Retry attempts: ${this.state.retryCount}`
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                {isRTL ? 'إعادة المحاولة' : 'Try Again'}
              </button>
              
              <button
                onClick={this.handleGoBack}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {isRTL ? 'العودة' : 'Go Back'}
              </button>
            </div>

            {/* Fallback Notice */}
            {this.props.fallbackToLTR && this.state.originalDirection === 'rtl' && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-xs text-yellow-700 dark:text-yellow-300">
                  {isRTL 
                    ? 'تم التبديل إلى الوضع الأيسر إلى الأيمن لتجنب مشاكل العرض'
                    : 'Switched to left-to-right mode to avoid display issues'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default RTLErrorBoundary;