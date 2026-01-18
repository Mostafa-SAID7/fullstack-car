/**
 * Protected Admin Route Component
 * Provides role-based route protection for administrative interfaces
 */

import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useAdminPermissions } from '../../hooks/auth/useAdminPermissions';
import { AdminRole, type PermissionCheck } from '../../types/admin';
import { Loader2, Shield, AlertTriangle } from 'lucide-react';

// Props for the ProtectedAdminRoute component
interface ProtectedAdminRouteProps {
  children: ReactNode;
  requiredRoles?: AdminRole[];
  requiredPermissions?: PermissionCheck[];
  requireAllRoles?: boolean;
  requireAllPermissions?: boolean;
  fallback?: ReactNode;
  redirectTo?: string;
  showUnauthorizedMessage?: boolean;
}

// Unauthorized Access Component
const UnauthorizedAccess: React.FC<{
  message?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}> = ({ 
  message = "You don't have permission to access this page.", 
  showRetry = false,
  onRetry 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
          <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Access Denied
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {message}
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
          
          {showRetry && onRetry && (
            <button
              onClick={onRetry}
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
          )}
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Loading Component
const AuthLoading: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
      <p className="text-gray-600 dark:text-gray-400">
        Verifying permissions...
      </p>
    </div>
  </div>
);

// Session Expired Component
const SessionExpired: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="max-w-md w-full mx-auto p-6">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-4">
          <AlertTriangle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Session Expired
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Your administrative session has expired. Please log in again to continue.
        </p>
        
        <button
          onClick={onLogin}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Log In Again
        </button>
      </div>
    </div>
  </div>
);

/**
 * ProtectedAdminRoute Component
 * 
 * Protects routes based on administrative roles and permissions.
 * Provides comprehensive access control with fallback options.
 */
export const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  requireAllRoles = false,
  requireAllPermissions = false,
  fallback,
  redirectTo = '/login',
  showUnauthorizedMessage = true
}) => {
  const location = useLocation();
  const { adminUser, isAuthenticated, isLoading, error } = useAdminAuth();
  const {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  } = useAdminPermissions();

  // Show loading while checking authentication
  if (isLoading) {
    return <AuthLoading />;
  }

  // Handle authentication errors
  if (error) {
    return (
      <SessionExpired 
        onLogin={() => window.location.href = redirectTo}
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !adminUser) {
    return (
      <Navigate 
        to={redirectTo} 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role requirements
  if (requiredRoles.length > 0) {
    const hasRequiredRoles = requireAllRoles 
      ? hasAllRoles(requiredRoles)
      : hasAnyRole(requiredRoles);

    if (!hasRequiredRoles) {
      if (fallback) {
        return <>{fallback}</>;
      }

      if (showUnauthorizedMessage) {
        const roleNames = requiredRoles.join(', ');
        const message = requireAllRoles
          ? `You need all of these roles: ${roleNames}`
          : `You need one of these roles: ${roleNames}`;

        return <UnauthorizedAccess message={message} />;
      }

      return <Navigate to="/error/403" replace />;
    }
  }

  // Check permission requirements
  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requireAllPermissions
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      if (fallback) {
        return <>{fallback}</>;
      }

      if (showUnauthorizedMessage) {
        const permissionNames = requiredPermissions
          .map(p => `${p.module}:${p.action}`)
          .join(', ');
        const message = requireAllPermissions
          ? `You need all of these permissions: ${permissionNames}`
          : `You need one of these permissions: ${permissionNames}`;

        return <UnauthorizedAccess message={message} />;
      }

      return <Navigate to="/error/403" replace />;
    }
  }

  // All checks passed, render children
  return <>{children}</>;
};

// Higher-order component for role-based protection
export const withAdminRoleProtection = <P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles: AdminRole[],
  options?: {
    requireAllRoles?: boolean;
    fallback?: ReactNode;
    redirectTo?: string;
  }
) => {
  const ProtectedComponent: React.FC<P> = (props) => (
    <ProtectedAdminRoute
      requiredRoles={requiredRoles}
      requireAllRoles={options?.requireAllRoles}
      fallback={options?.fallback}
      redirectTo={options?.redirectTo}
    >
      <Component {...props} />
    </ProtectedAdminRoute>
  );

  ProtectedComponent.displayName = `withAdminRoleProtection(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
};

// Higher-order component for permission-based protection
export const withAdminPermissionProtection = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: PermissionCheck[],
  options?: {
    requireAllPermissions?: boolean;
    fallback?: ReactNode;
    redirectTo?: string;
  }
) => {
  const ProtectedComponent: React.FC<P> = (props) => (
    <ProtectedAdminRoute
      requiredPermissions={requiredPermissions}
      requireAllPermissions={options?.requireAllPermissions}
      fallback={options?.fallback}
      redirectTo={options?.redirectTo}
    >
      <Component {...props} />
    </ProtectedAdminRoute>
  );

  ProtectedComponent.displayName = `withAdminPermissionProtection(${Component.displayName || Component.name})`;
  
  return ProtectedComponent;
};

// Convenience components for specific admin roles
export const SuperAdminRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ProtectedAdminRoute 
    requiredRoles={[AdminRole.SUPER_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </ProtectedAdminRoute>
);

export const AdministrationAdminRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ProtectedAdminRoute 
    requiredRoles={[AdminRole.ADMINISTRATION_ADMIN, AdminRole.SUPER_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </ProtectedAdminRoute>
);

export const ContentAdminRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ProtectedAdminRoute 
    requiredRoles={[AdminRole.CONTENT_ADMIN, AdminRole.SUPER_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </ProtectedAdminRoute>
);

export const MarketplaceAdminRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ProtectedAdminRoute 
    requiredRoles={[AdminRole.MARKETPLACE_ADMIN, AdminRole.SUPER_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </ProtectedAdminRoute>
);

export const AIAgentAdminRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ProtectedAdminRoute 
    requiredRoles={[AdminRole.AI_AGENT_ADMIN, AdminRole.SUPER_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </ProtectedAdminRoute>
);

export const MarketingAdminRoute: React.FC<{ children: ReactNode; fallback?: ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <ProtectedAdminRoute 
    requiredRoles={[AdminRole.MARKETING_ADMIN, AdminRole.SUPER_ADMIN]} 
    fallback={fallback}
  >
    {children}
  </ProtectedAdminRoute>
);

// Export default
export default ProtectedAdminRoute;