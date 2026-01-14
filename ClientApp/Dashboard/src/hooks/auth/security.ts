// Auth Hook - Security Functions

import { authService } from '../../services/auth';

export const useSecurityFunctions = (setLoading: (loading: boolean) => void, setError: (error: string | null) => void) => {
  const getSecurityLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getSecurityLogs();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load security logs';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getActiveSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.getUserSessions();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load active sessions';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const revokeSession = async (sessionId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.revokeSession(sessionId);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to revoke session';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTwoFactorStatus = () => {
    // This would need to be implemented in the auth service
    return { enabled: false };
  };

  const toggleTwoFactor = async (_enabled: boolean) => {
    // This would need to be implemented in the auth service
    throw new Error('Two-factor authentication not implemented yet');
  };

  return {
    getSecurityLogs,
    getActiveSessions,
    revokeSession,
    getTwoFactorStatus,
    toggleTwoFactor
  };
};





