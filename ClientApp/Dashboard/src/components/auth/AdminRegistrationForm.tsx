/**
 * Administrative User Registration Form Component
 * Specialized registration form for creating administrative users (Super Admin only)
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { AdminRole } from '../../types/admin';
import { 
  Eye, 
  EyeOff, 
  Loader2, 
  Shield, 
  AlertCircle, 
  CheckCircle,
  Lock,
  Mail,
  User,
  UserPlus,
  Crown,
  Settings,
  FileText,
  ShoppingCart,
  Bot,
  TrendingUp
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

// Validation schema for admin registration
const adminRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain uppercase, lowercase, number, and special character'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  roles: z
    .array(z.nativeEnum(AdminRole))
    .min(1, 'At least one role must be selected'),
  sendWelcomeEmail: z.boolean().optional(),
  requirePasswordChange: z.boolean().optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type AdminRegistrationFormData = z.infer<typeof adminRegistrationSchema>;

// Props for the AdminRegistrationForm component
interface AdminRegistrationFormProps {
  onSuccess?: (adminUser: any) => void;
  onCancel?: () => void;
  className?: string;
}

// Role selection component
const RoleSelector: React.FC<{
  selectedRoles: AdminRole[];
  onChange: (roles: AdminRole[]) => void;
  error?: string;
}> = ({ selectedRoles, onChange, error }) => {
  const roleInfo: Record<AdminRole, { 
    title: string; 
    description: string; 
    icon: React.ComponentType<any>; 
    color: string;
    permissions: string[];
  }> = {
    [AdminRole.SUPER_ADMIN]: {
      title: 'Super Administrator',
      description: 'Full system access and admin management',
      icon: Crown,
      color: 'border-red-200 bg-red-50 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
      permissions: ['All system permissions', 'Admin management', 'System configuration']
    },
    [AdminRole.ADMINISTRATION_ADMIN]: {
      title: 'Administration Admin',
      description: 'User management and system administration',
      icon: Settings,
      color: 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
      permissions: ['User management', 'System settings', 'Analytics access', 'Audit logs']
    },
    [AdminRole.CONTENT_ADMIN]: {
      title: 'Content Administrator',
      description: 'Content management and moderation',
      icon: FileText,
      color: 'border-green-200 bg-green-50 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
      permissions: ['Content creation', 'Media management', 'Content moderation', 'SEO tools']
    },
    [AdminRole.MARKETPLACE_ADMIN]: {
      title: 'Marketplace Admin',
      description: 'Marketplace and vendor management',
      icon: ShoppingCart,
      color: 'border-purple-200 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300',
      permissions: ['Vendor management', 'Product approval', 'Transaction oversight', 'Dispute resolution']
    },
    [AdminRole.AI_AGENT_ADMIN]: {
      title: 'AI Agent Admin',
      description: 'AI agent configuration and training',
      icon: Bot,
      color: 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300',
      permissions: ['AI model training', 'Agent configuration', 'Conversation monitoring', 'Performance analysis']
    },
    [AdminRole.MARKETING_ADMIN]: {
      title: 'Marketing Admin',
      description: 'Marketing campaigns and analytics',
      icon: TrendingUp,
      color: 'border-orange-200 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300',
      permissions: ['Campaign management', 'Audience targeting', 'Social media', 'Marketing analytics']
    }
  };

  const toggleRole = (role: AdminRole) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter(r => r !== role)
      : [...selectedRoles, role];
    onChange(newRoles);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Administrative Roles *
      </label>
      <div className="space-y-3">
        {Object.entries(roleInfo).map(([role, info]) => {
          const Icon = info.icon;
          const isSelected = selectedRoles.includes(role as AdminRole);
          
          return (
            <div
              key={role}
              onClick={() => toggleRole(role as AdminRole)}
              className={`
                p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${isSelected 
                  ? `${info.color} border-opacity-100` 
                  : 'border-gray-200 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700'
                }
              `}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className={`
                    p-2 rounded-lg
                    ${isSelected ? 'bg-white bg-opacity-50' : 'bg-gray-100 dark:bg-gray-700'}
                  `}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium">{info.title}</h4>
                    {isSelected && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                  </div>
                  <p className="text-xs mt-1 opacity-80">{info.description}</p>
                  <div className="mt-2">
                    <p className="text-xs font-medium mb-1">Key Permissions:</p>
                    <ul className="text-xs space-y-0.5 opacity-75">
                      {info.permissions.map((permission, index) => (
                        <li key={index}>• {permission}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
          <AlertCircle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * AdminRegistrationForm Component
 * 
 * Provides a specialized registration form for creating administrative users.
 * Only accessible to Super Admins with comprehensive role assignment capabilities.
 */
export const AdminRegistrationForm: React.FC<AdminRegistrationFormProps> = ({
  onSuccess,
  onCancel,
  className = ''
}) => {
  const { adminUser } = useAdminAuth();
  
  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    setError: setFormError
  } = useForm<AdminRegistrationFormData>({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      roles: [],
      sendWelcomeEmail: true,
      requirePasswordChange: true
    }
  });

  const selectedRoles = watch('roles');

  // Check if current user is Super Admin
  const isSuperAdmin = adminUser?.roles?.includes(AdminRole.SUPER_ADMIN);

  if (!isSuperAdmin) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
              <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Only Super Administrators can create new admin accounts.
            </p>
            {onCancel && (
              <Button
                onClick={onCancel}
                variant="outline"
                className="mt-4"
              >
                Go Back
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // Handle form submission
  const onSubmit = async (data: AdminRegistrationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate API call for admin registration
      // In a real implementation, this would call an admin registration service
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock successful registration
      const newAdminUser = {
        id: `admin_${Date.now()}`,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      console.log('Admin user created:', newAdminUser);

      if (onSuccess) {
        onSuccess(newAdminUser);
      }
    } catch (error) {
      setSubmitError('Failed to create admin account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto ${className}`}>
      <Card className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-4">
            <UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Admin Account
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Create a new administrative user with specific roles and permissions
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  autoComplete="given-name"
                  disabled={isSubmitting}
                  className={`
                    block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
                    ${errors.firstName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="John"
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  autoComplete="family-name"
                  disabled={isSubmitting}
                  className={`
                    block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
                    ${errors.lastName ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Doe"
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Address *
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
                disabled={isSubmitting}
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

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  className={`
                    block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
                    ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Enter secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                  className={`
                    block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
                    dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
                    ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'}
                  `}
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:cursor-not-allowed"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <RoleSelector
            selectedRoles={selectedRoles}
            onChange={(roles) => setValue('roles', roles)}
            error={errors.roles?.message}
          />

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                {...register('sendWelcomeEmail')}
                id="sendWelcomeEmail"
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <label htmlFor="sendWelcomeEmail" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Send welcome email with login instructions
              </label>
            </div>

            <div className="flex items-center">
              <input
                {...register('requirePasswordChange')}
                id="requirePasswordChange"
                type="checkbox"
                disabled={isSubmitting}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
              />
              <label htmlFor="requirePasswordChange" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Require password change on first login
              </label>
            </div>
          </div>

          {/* Error Message */}
          {submitError && (
            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-600 dark:text-red-400">
                  {submitError}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Create Admin Account
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminRegistrationForm;