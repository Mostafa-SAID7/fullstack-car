import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = []
}) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => user.roles?.includes(role));
    if (!hasRequiredRole) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-4">
              This dashboard is restricted to administrators only.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Current user: {user.email} | Roles: {user.roles.join(', ')}
            </p>
            <button
              onClick={() => {
                // Clear auth data and force re-login
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                localStorage.removeItem('tokenExpiry');
                window.location.reload();
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </button>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};