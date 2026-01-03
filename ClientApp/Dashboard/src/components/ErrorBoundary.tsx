import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center">
            <div className="glass rounded-3xl p-8 space-y-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Something went wrong
                </h1>
                <p className="text-muted-foreground">
                  We encountered an unexpected error. Please try refreshing the page or go back to the dashboard.
                </p>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-left">
                  <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                    Error Details:
                  </h3>
                  <pre className="text-xs text-red-600 dark:text-red-400 overflow-auto">
                    {this.state.error.message}
                  </pre>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={this.handleReload}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2 py-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 py-3"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}