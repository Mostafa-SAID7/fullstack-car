import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loading } from '../../feedback/loading/Loading';

import { authService } from '../../../services/auth';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login',
  loadingComponent
}) => {
  const location = useLocation();
  const [isChecking, setIsChecking] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [hasRequiredRoles, setHasRequiredRoles] = React.useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        const hasRoles = requiredRoles.length === 0 || authService.hasAnyRole(requiredRoles);
        const currentUser = authService.getCurrentUser();

        console.log('[ProtectedRoute] Auth check:', {
          path: location.pathname,
          authenticated,
          requiredRoles,
          hasRoles,
          currentUser,
          token: !!localStorage.getItem('auth_token'),
          userInStorage: !!localStorage.getItem('auth_user')
        });

        setIsAuthenticated(authenticated);
        setHasRequiredRoles(hasRoles);
      } catch (error) {
        console.error('[ProtectedRoute] Auth check failed:', error);
        setIsAuthenticated(false);
        setHasRequiredRoles(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
    
    // Also listen for storage changes (in case auth state changes in another tab)
    const handleStorageChange = () => {
      console.log('[ProtectedRoute] Storage changed, rechecking auth...');
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [requiredRoles, location.pathname]); // Re-check on route change

  // Show loading state while checking authentication
  if (isChecking) {
    return loadingComponent || <Loading fullScreen text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page (or dashboard root) if user doesn't have required roles
  if (requiredRoles.length > 0 && !hasRequiredRoles) {
    console.warn('User missing required roles:', requiredRoles);
    // Redirect to 403 Forbidden page
    return <Navigate to="/error/403" state={{ from: location }} replace />;
  }

  // Render protected content
  return <>{children}</>;
};

// Higher-order component version for class components
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[],
  fallbackPath?: string
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute requiredRoles={requiredRoles} fallbackPath={fallbackPath}>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

export default ProtectedRoute;

