/**
 * Administrative Login Form Component
 * Specialized login form for administrative users with role-based features
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole, type AdminLoginRequest } from '../../types/admin';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Lock,
  Mail,
  User
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

// Validation schema for admin login
const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional()
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

// Props for the AdminLoginForm component
interface AdminLoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showRoleInfo?: boolean;
  className?: string;
}

// Role information display
const RoleInfoCard: React.FC<{ roles: AdminRole[] }> = ({ roles }) => {
  const roleDescriptions: Record<AdminRole, { title: string; description: string; color: string }> = {
    [AdminRole.SUPER_ADMIN]: {
      title: 'Super Administrator',
      description: 'Full system access and admin management',
      color: 'text-red-600 bg-red-50 border-red-200'
    },
    [AdminRole.ADMINISTRATION_ADMIN]: {
      title: 'Administration Admin',
      description: 'User management and system administration',
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    },
    [AdminRole.CONTENT_ADMIN]: {
      title: 'Content Administrator',
      description: 'Content management and moderation',
      color: 'text-green-600 bg-green-50 border-green-200'
    },
    [AdminRole.MARKETPLACE_ADMIN]: {
      title: 'Marketplace Admin',
      description: 'Marketplace and vendor management',
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    },
    [AdminRole.AI_AGENT_ADMIN]: {
      title: 'AI Agent Admin',
      description: 'AI agent configuration and training',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    },
    [AdminRole.MARKETING_ADMIN]: {
      title: 'Marketing Admin',
      description: 'Marketing campaigns and analytics',
      color: 'text-orange-600 bg-orange-50 border-orange-200'
    }
  };

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Your Administrative Roles:
      </h4>
      {roles.map((role) => {
        const info = roleDescriptions[role];
        return (
          <div
            key={role}
            className={`p-3 rounded-lg border ${info.color} dark:bg-gray-800 dark:border-gray-600`}
          >
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="font-medium text-sm">{info.title}</span>
            </div>
            <p className="text-xs mt-1 opacity-80">{info.description}</p>
          </div>
        );
      })}
    </div>
  );
};

/**
 * AdminLoginForm Component
 * 
 * Provides a specialized login form for administrative users with:
 * - Role-based validation
 * - Enhanced security features
 * - Administrative session management
 * - Role information display
 */
export const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onSuccess,
  redirectTo = '/dashboard',
  showRoleInfo = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError, adminUser } = useAdminAuth();

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState<Date | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  // Handle lockout timer
  useEffect(() => {
    if (lockoutTime) {
      const timer = setInterval(() => {
        if (new Date() > lockoutTime) {
          setIsLocked(false);
          setLockoutTime(null);
          setLoginAttempts(0);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  // Clear errors when user starts typing
  useEffect(() => {
    clearError();
    clearErrors();
  }, [clearError, clearErrors]);

  // Handle form submission
  const onSubmit = async (data: AdminLoginFormData) => {
    if (isLocked) {
      setFormError('root', {
        message: 'Account temporarily locked due to multiple failed attempts. Please try again later.'
      });
      return;
    }

    try {
      const result = await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe
      });

      if (result.succeeded) {
        // Reset login attempts on success
        setLoginAttempts(0);
        setIsLocked(false);
        setLockoutTime(null);

        // Call success callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate to intended destination or dashboard
          const from = (location.state as any)?.from || redirectTo;
          navigate(from, { replace: true });
        }
      } else {
        // Handle failed login
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockoutTime(new Date(Date.now() + 15 * 60 * 1000)); // 15 minutes
          setFormError('root', {
            message: 'Too many failed login attempts. Account locked for 15 minutes.'
          });
        } else {
          const remainingAttempts = 5 - newAttempts;
          setFormError('root', {
            message: `${result.message || 'Login failed'}. ${remainingAttempts} attempts remaining.`
          });
        }
      }
    } catch (err) {
      setFormError('root', {
        message: 'An unexpected error occurred. Please try again.'
      });
    }
  };

  // Calculate remaining lockout time
  const getRemainingLockoutTime = (): string => {
    if (!lockoutTime) return '';
    
    const remaining = Math.max(0, lockoutTime.getTime() - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      <Card className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Administrative Login
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Sign in to access the administrative dashboard
          </p>
        </div>

        {/* Show role info if user is already logged in */}
        {adminUser && showRoleInfo && (
          <RoleInfoCard roles={adminUser.roles} />
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('email')}
                type="email"
                id="email"
                autoComplete="email"
                disabled={isLocked || isLoading}
                className={`
                  block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                  dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
                  ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                `}
                placeholder="admin@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-400" />
              </div>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                disabled={isLocked || isLoading}
                className={`
                  block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                  dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
                  ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                `}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLocked || isLoading}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              {...register('rememberMe')}
              id="rememberMe"
              type="checkbox"
              disabled={isLocked || isLoading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
              Keep me signed in for 30 days
            </label>
          </div>

          {/* Error Messages */}
          {(error || errors.root) && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error || errors.root?.message}
                </p>
              </div>
            </div>
          )}

          {/* Lockout Warning */}
          {isLocked && (
            <div className="p-3 rounded-md bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Account locked. Try again in {getRemainingLockoutTime()}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLocked || isLoading || isSubmitting}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Signing in...
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Sign In to Dashboard
              </>
            )}
          </Button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">Security Notice:</p>
              <ul className="space-y-1">
                <li>• Administrative sessions are monitored and logged</li>
                <li>• Account will be locked after 5 failed attempts</li>
                <li>• Sessions expire after 30 minutes of inactivity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Help Links */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/forgot-password')}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
          >
            Forgot your password?
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AdminLoginForm;