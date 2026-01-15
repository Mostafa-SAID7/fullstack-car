import { useEffect, useState } from 'react';
import { loadingService, LoadingState } from '../../services/loading/loading.service';

export const LoadingOverlay = () => {
  const [loadingStates, setLoadingStates] = useState<Map<string, LoadingState>>(new Map());

  useEffect(() => {
    const unsubscribe = loadingService.subscribe((state) => {
      setLoadingStates(new Map(state));
    });

    return unsubscribe;
  }, []);

  const isLoading = loadingStates.size > 0;
  const firstState = Array.from(loadingStates.values())[0];
  const message = firstState?.message;

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          {message && <p className="text-gray-700 text-center">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export const LoadingSpinner = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} ${className}`} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};
