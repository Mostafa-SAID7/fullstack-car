import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import type { LoginRequest } from '../../types/auth';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Car, 
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoginForm: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      await login(formData);
      // Redirect will be handled by the auth hook
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div className="login-container">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/25">
              <Car className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-muted-foreground">
            Sign in to your Community Car dashboard
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="login-form rounded-3xl p-8 space-y-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input pl-11"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input pl-11 pr-11"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <label htmlFor="remember-me" className="ml-2 text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>

              <a 
                href="/forgot-password" 
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </a>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "login-button flex items-center justify-center gap-2",
                loading && "opacity-50 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-card text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Google', color: 'bg-red-500' },
              { name: 'GitHub', color: 'bg-gray-900' },
              { name: 'Facebook', color: 'bg-blue-600' }
            ].map((provider) => (
              <button
                key={provider.name}
                type="button"
                className="btn-secondary flex items-center justify-center py-3 px-4 rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                <div className={cn("w-2 h-2 rounded-full mr-2", provider.color)}></div>
                {provider.name}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Sign up here
              </a>
            </p>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 gap-4"
        >
          <div className="glass rounded-2xl p-4 text-center">
            <Sparkles className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-xs font-medium text-muted-foreground">AI Powered</p>
          </div>
          <div className="glass rounded-2xl p-4 text-center">
            <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs font-medium text-muted-foreground">Secure Access</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};