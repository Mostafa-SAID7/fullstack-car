/**
 * Utility functions for navigating to error pages
 */

export const navigateToError = {
  /**
   * Navigate to 404 Not Found page
   */
  notFound: () => {
    window.location.href = '/error/404';
  },

  /**
   * Navigate to 403 Forbidden page
   */
  forbidden: () => {
    window.location.href = '/error/403';
  },

  /**
   * Navigate to 500 Server Error page
   */
  serverError: () => {
    window.location.href = '/error/500';
  },

  /**
   * Navigate to appropriate error page based on HTTP status code
   */
  byStatusCode: (statusCode: number) => {
    switch (statusCode) {
      case 403:
        navigateToError.forbidden();
        break;
      case 404:
        navigateToError.notFound();
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        navigateToError.serverError();
        break;
      default:
        // For other errors, default to server error
        navigateToError.serverError();
        break;
    }
  }
};

/**
 * Error boundary helper to determine if error should redirect to full error page
 */
export const shouldRedirectToErrorPage = (error: Error): boolean => {
  // Redirect for critical errors that prevent the app from functioning
  return (
    error.message.includes('ChunkLoadError') ||
    error.message.includes('Loading chunk') ||
    error.name === 'ChunkLoadError' ||
    error.message.includes('Network Error') ||
    error.message.includes('Failed to fetch')
  );
};

/**
 * Handle API errors and navigate to appropriate error pages
 */
export const handleApiError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    navigateToError.byStatusCode(status);
  } else if (error.request) {
    // Network error or no response
    navigateToError.serverError();
  } else {
    // Other error
    console.error('Unexpected error:', error);
    navigateToError.serverError();
  }
};

export default navigateToError;