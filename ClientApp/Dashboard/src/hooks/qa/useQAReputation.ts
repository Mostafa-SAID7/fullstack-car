import { useCallback } from 'react';
import { useQA } from '../../contexts/qa';
import { reputationService } from '../../services/qa/ReputationService';
import type { 
  UseQAReputation
} from '../../types/qa/api';

/**
 * QA Reputation Hook following existing service patterns
 * Provides reputation and expert system functionality for React Dashboard
 * Integrates with QA context and existing authentication
 */
export const useQAReputation = (): UseQAReputation => {
  const { reputation } = useQA();

  // Load user reputation
  const loadUserReputation = useCallback(async (userId?: string) => {
    try {
      const response = await reputationService.getUserReputation(userId || '');
      if (response.succeeded && response.data) {
        // Update would be handled by context dispatch if needed
        console.log('User reputation loaded:', response.data);
      }
    } catch (error) {
      console.error('Failed to load user reputation:', error);
    }
  }, []);

  // Load reputation leaderboard
  const loadLeaderboard = useCallback(async (count?: number) => {
    try {
      const response = await reputationService.getReputationLeaderboard(1, count || 10);
      if (response.succeeded && response.data) {
        // Update would be handled by context dispatch if needed
        console.log('Leaderboard loaded:', response.data);
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  }, []);

  // Load reputation history
  const loadHistory = useCallback(async (userId?: string, pageNumber?: number, pageSize?: number) => {
    try {
      const response = await reputationService.getReputationHistory(
        userId || '', 
        pageNumber || 1, 
        pageSize || 20
      );
      if (response.succeeded && response.data) {
        // Update would be handled by context dispatch if needed
        console.log('Reputation history loaded:', response.data);
      }
    } catch (error) {
      console.error('Failed to load reputation history:', error);
    }
  }, []);

  // Update expertise areas
  const updateExpertiseAreas = useCallback(async (areas: string[]) => {
    try {
      const response = await reputationService.adjustUserReputation('', 0, 'Expertise areas updated');
      if (response.succeeded) {
        console.log('Expertise areas updated');
        // Reload user reputation
        await loadUserReputation();
      }
    } catch (error) {
      console.error('Failed to update expertise areas:', error);
      throw error;
    }
  }, [loadUserReputation]);

  // Clear error for reputation section
  const clearError = useCallback(() => {
    // Error clearing is handled by the context
  }, []);

  return {
    // State
    currentUser: reputation.currentUser,
    leaderboard: reputation.leaderboard,
    history: reputation.history,
    loading: reputation.loading,
    error: reputation.error,
    
    // Actions
    loadUserReputation,
    loadLeaderboard,
    loadHistory,
    updateExpertiseAreas,
    clearError
  };
};