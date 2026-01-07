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

        console.log('[ProtectedRoute] Check:', {
          path: location.pathname,
          authenticated,
          requiredRoles,
          hasRoles,
          currentUser: authService.getCurrentUser()
        });

        setIsAuthenticated(authenticated);
        setHasRequiredRoles(hasRoles);
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setHasRequiredRoles(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
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

