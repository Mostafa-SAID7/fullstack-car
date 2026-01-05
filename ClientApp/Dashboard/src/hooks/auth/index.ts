// Auth Hook - Main Export (composed from sub-modules)

import { useAuthState } from './state';
import { useAuthFunctions } from './auth';
import { useProfileFunctions } from './profile';
import { usePasswordFunctions } from './password';
import { useSecurityFunctions } from './security';
import { useAccountFunctions } from './account';
import { useAuthEffects } from './effects';

export const useAuth = () => {
  const {
    user,
    loading,
    error,
    isAuthenticated,
    setUser,
    setLoading,
    setError,
    clearError
  } = useAuthState();

  // Initialize effects
  useAuthEffects(setUser);

  // Authentication functions
  const {
    login,
    register,
    logout,
    refreshToken
  } = useAuthFunctions(setLoading, setError);

  // Profile functions
  const {
    updateProfile,
    changePassword,
    getProfile
  } = useProfileFunctions(setLoading, setError);

  // Password recovery functions
  const {
    confirmEmail,
    forgotPassword,
    resetPassword
  } = usePasswordFunctions(setLoading, setError);

  // Security functions
  const {
    getSecurityLogs,
    getActiveSessions,
    revokeSession,
    getTwoFactorStatus,
    toggleTwoFactor
  } = useSecurityFunctions(setLoading, setError);

  // Account functions
  const {
    uploadAvatar,
    deleteAvatar,
    getPrivacySettings,
    updatePrivacySettings,
    deactivateAccount,
    deleteAccount
  } = useAccountFunctions(setLoading, setError);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    changePassword,
    confirmEmail,
    forgotPassword,
    resetPassword,
    getProfile,
    getSecurityLogs,
    getActiveSessions,
    revokeSession,
    getTwoFactorStatus,
    toggleTwoFactor,
    uploadAvatar,
    deleteAvatar,
    getPrivacySettings,
    updatePrivacySettings,
    deactivateAccount,
    deleteAccount,
    clearError
  };
};
