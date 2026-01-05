import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loading } from '../../feedback/loading/Loading';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
  loadingComponent?: React.ReactNode;
}

// Mock authentication service - replace with your actual auth service
const authService = {
  isAuthenticated: () => {
    // Check if user is authenticated (replace with your actual logic)
    return !!localStorage.getItem('auth_token');
  },
  getUserRoles: (): string[] => {
    // Get user roles from storage or API (replace with your actual logic)
    const roles = localStorage.getItem('user_roles');
    return roles ? JSON.parse(roles) : [];
  },
  hasRole: (role: string): boolean => {
    const userRoles = authService.getUserRoles();
    return userRoles.includes(role);
  },
  hasAnyRole: (roles: string[]): boolean => {
    return roles.some(role => authService.hasRole(role));
  }
};

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
        // Simulate async auth check (replace with your actual auth check)
        await new Promise(resolve => setTimeout(resolve, 100));

        const authenticated = authService.isAuthenticated();
        const hasRoles = requiredRoles.length === 0 || authService.hasAnyRole(requiredRoles);

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
  }, [requiredRoles]);

  // Show loading state while checking authentication
  if (isChecking) {
    return loadingComponent || <Loading fullScreen text="Checking authentication..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if user doesn't have required roles
  if (requiredRoles.length > 0 && !hasRequiredRoles) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
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

