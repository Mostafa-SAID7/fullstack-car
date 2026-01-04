import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { LoginRequest } from '../../types/auth';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Car,
  ArrowRight,
  Shield
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const LoginForm: React.FC = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
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
      // Navigate to dashboard after successful login
      navigate('/dashboard');
    } catch (_error) {
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden main-content-bg">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-pink-500/5 to-purple-500/8" />
      <div className="absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-primary/15 to-pink-500/10 rounded-full blur-3xl -translate-y-36 md:-translate-y-48 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-purple-500/15 to-blue-500/10 rounded-full blur-3xl translate-y-40 md:translate-y-48 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-primary/3 via-transparent to-purple-500/3 rounded-full blur-[100px]" />

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-ping"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8 sm:mb-10"
        >
          <motion.div
            className="flex justify-center mb-6 sm:mb-8"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-primary via-pink-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/30 group-hover:shadow-primary/40 transition-all duration-300 group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-transparent rounded-3xl group-hover:from-white/40 transition-all duration-300" />
                <Car className="w-12 h-12 sm:w-14 sm:h-14 text-white relative z-10 group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 group-hover:animate-pulse" />
              </div>
              <motion.div
                className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-3 border-background flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-sm" />
              </motion.div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-500/30 rounded-full animate-ping" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-blue-500/60 rounded-full" />
            </div>
          </motion.div>
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/90 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Welcome Back
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-sm mx-auto font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Sign in to your Community Car dashboard to manage your vehicles and services
          </motion.p>
        </motion.div>

        {/* Enhanced Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="relative"
        >
          {/* Glassmorphism container */}
          <div className="bg-card/95 backdrop-blur-2xl border border-border/60 rounded-3xl shadow-2xl shadow-black/20 p-6 sm:p-8 lg:p-10 relative overflow-hidden group hover:shadow-primary/10 transition-all duration-500">
            {/* Enhanced inner glow effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-pink-500/5 to-purple-500/8 rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 rounded-3xl" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl group-hover:blur-xl transition-all duration-500" />

            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Enhanced Email Field */}
            <motion.div
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <label htmlFor="email" className="text-sm sm:text-base font-bold text-foreground block text-left flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="relative bg-background/60 backdrop-blur-sm border border-border/70 rounded-2xl px-4 py-4 pl-12 sm:pl-14 pr-4 text-sm sm:text-base font-medium w-full h-14 sm:h-16 transition-all duration-300 focus:outline-none focus:border-primary/80 focus:ring-4 focus:ring-primary/10 focus:bg-background/80 hover:border-border/90 hover:shadow-lg hover:shadow-primary/5 placeholder:text-muted-foreground/70"
                  placeholder="Enter your email address"
                />
                <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/80 group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-300 z-10" />
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </motion.div>

            {/* Enhanced Password Field */}
            <motion.div
              className="space-y-3 sm:space-y-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <label htmlFor="password" className="text-sm sm:text-base font-bold text-foreground block text-left flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="relative bg-background/60 backdrop-blur-sm border border-border/70 rounded-2xl px-4 py-4 pl-12 sm:pl-14 pr-14 sm:pr-16 text-sm sm:text-base font-medium w-full h-14 sm:h-16 transition-all duration-300 focus:outline-none focus:border-primary/80 focus:ring-4 focus:ring-primary/10 focus:bg-background/80 hover:border-border/90 hover:shadow-lg hover:shadow-primary/5 placeholder:text-muted-foreground/70"
                  placeholder="Enter your password"
                />
                <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground/80 group-focus-within:text-primary group-focus-within:scale-110 transition-all duration-300 z-10" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-muted-foreground/80 hover:text-primary hover:bg-primary/10 rounded-xl p-2.5 transition-all duration-300 z-10 hover:scale-110 active:scale-95"
                >
                  {showPassword ?
                    <EyeOff className="w-5 h-5 sm:w-6 sm:h-6" /> :
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
                  }
                </button>
                <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-left rounded-full" />
              </div>
            </motion.div>

            {/* Enhanced Remember Me & Forgot Password */}
            <motion.div
              className="flex items-center justify-between pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
            >
              <div className="flex items-center space-x-3 group">
                <div className="relative">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="peer h-5 w-5 text-primary border-2 border-border/60 rounded-lg focus:ring-4 focus:ring-primary/20 focus:ring-offset-0 focus:outline-none transition-all duration-300 hover:border-primary/60 checked:bg-primary checked:border-primary"
                  />
                  <div className="absolute inset-0 rounded-lg bg-primary/10 opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
                <label
                  htmlFor="remember-me"
                  className="text-sm font-semibold text-muted-foreground cursor-pointer select-none group-hover:text-foreground transition-colors"
                >
                  Remember me
                </label>
              </div>

              <motion.a
                href="/forgot-password"
                className="text-sm font-bold text-primary hover:text-primary/80 transition-all duration-300 hover:underline relative group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Forgot password?
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-purple-500 group-hover:w-full transition-all duration-300" />
              </motion.a>
            </motion.div>

            {/* Enhanced Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative mt-6 sm:mt-8"
              >
                <div className="bg-gradient-to-r from-red-50/80 via-red-100/40 to-red-50/80 dark:from-red-950/60 dark:via-red-900/30 dark:to-red-950/60 backdrop-blur-sm border border-red-200/60 dark:border-red-800/40 rounded-2xl p-5 shadow-lg shadow-red-500/10">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/50 dark:to-red-800/50 flex items-center justify-center flex-shrink-0 shadow-sm"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-red-800 dark:text-red-200 leading-relaxed">{error}</p>
                      <div className="mt-2 w-full h-1 bg-red-200/50 dark:bg-red-800/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Enhanced Submit Button */}
            <motion.div
              className="mt-8 sm:mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <motion.button
                type="submit"
                disabled={loading}
                className={cn(
                  "group relative w-full h-14 sm:h-16 bg-gradient-to-r from-primary via-pink-500 to-purple-600 text-white font-bold text-base sm:text-lg rounded-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none overflow-hidden",
                  loading && "cursor-not-allowed"
                )}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Animated background gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-pink-500/80 to-purple-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />

                {/* Button content */}
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-white/30 border-t-white"></div>
                      <span className="font-semibold">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Sign In to Dashboard</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
                    </>
                  )}
                </div>

                {/* Border glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/50 via-pink-500/50 to-purple-600/50 opacity-0 group-hover:opacity-100 blur-sm -z-10 transition-opacity duration-500" />
              </motion.button>
            </motion.div>
          </form>

          {/* Enhanced Divider */}
          <motion.div
            className="relative my-10 sm:my-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-border/60 to-transparent" />
            </div>
            <div className="relative flex justify-center">
              <div className="px-6 py-2 bg-card/80 backdrop-blur-sm border border-border/40 rounded-full shadow-sm">
                <span className="text-sm font-semibold text-muted-foreground bg-gradient-to-r from-muted-foreground to-muted-foreground/80 bg-clip-text">
                  Or continue with
                </span>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Social Login */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            {[
              {
                name: 'Google',
                icon: 'G',
                bgColor: 'bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/40 dark:to-red-900/20',
                borderColor: 'border-red-200/60 dark:border-red-800/40',
                iconColor: 'text-red-600 dark:text-red-400',
                hoverColor: 'hover:shadow-red-500/20'
              },
              {
                name: 'GitHub',
                icon: 'GH',
                bgColor: 'bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-950/40 dark:to-gray-900/20',
                borderColor: 'border-gray-200/60 dark:border-gray-800/40',
                iconColor: 'text-gray-700 dark:text-gray-300',
                hoverColor: 'hover:shadow-gray-500/20'
              },
              {
                name: 'Facebook',
                icon: 'f',
                bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/40 dark:to-blue-900/20',
                borderColor: 'border-blue-200/60 dark:border-blue-800/40',
                iconColor: 'text-blue-600 dark:text-blue-400',
                hoverColor: 'hover:shadow-blue-500/20'
              }
            ].map((provider, index) => (
              <motion.button
                key={provider.name}
                type="button"
                className={cn(
                  "group relative flex items-center justify-center py-4 px-6 rounded-2xl border transition-all duration-500 hover:shadow-xl overflow-hidden",
                  provider.bgColor,
                  provider.borderColor,
                  provider.hoverColor
                )}
                whileHover={{
                  scale: 1.03,
                  y: -2
                }}
                whileTap={{ scale: 0.97 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 1.0 + index * 0.1
                }}
              >
                {/* Button background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <div className={cn(
                  "relative z-10 w-10 h-10 rounded-xl bg-background/80 backdrop-blur-sm border border-border/30 flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm",
                  provider.iconColor
                )}>
                  <span className="text-base font-bold">{provider.icon}</span>
                </div>
                <span className="relative z-10 text-sm font-bold text-foreground group-hover:text-foreground/90 transition-colors">
                  {provider.name}
                </span>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.button>
            ))}
          </motion.div>

          {/* Close the glassmorphism container */}
          </div>
        </motion.div>

      </div>
    </div>
  );
};