import { useState, useCallback } from 'react';
import { qaService } from '../../services/qa/QAService';
import { useAuth } from '../auth/useAuth';

/**
 * QA Moderation Hook following existing service patterns
 * Provides moderation functionality for React Dashboard
 * Integrates with existing authentication and admin permissions
 */
export const useQAModeration = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, canModerateContent, isAdmin } = useAuth();

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Helper for error handling
  const handleError = useCallback((err: any) => {
    const errorMessage = err?.message || err?.toString() || 'Moderation action failed';
    setError(errorMessage);
    setLoading(false);
  }, []);

  // Bulk question operations
  const bulkDeleteQuestions = useCallback(async (questionIds: string[]) => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for moderation');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.bulkDeleteQuestions(questionIds);
      console.log(`Bulk deleted ${questionIds.length} questions`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  const bulkCloseQuestions = useCallback(async (questionIds: string[], reason: string) => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for moderation');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.bulkCloseQuestions(questionIds, reason);
      console.log(`Bulk closed ${questionIds.length} questions`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  // Bulk answer operations
  const bulkDeleteAnswers = useCallback(async (answerIds: string[]) => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for moderation');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.bulkDeleteAnswers(answerIds);
      console.log(`Bulk deleted ${answerIds.length} answers`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  // Content flagging
  const flagContent = useCallback(async (contentId: string, contentType: 'Question' | 'Answer', reason: string) => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for moderation');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.flagContent(contentId, contentType, reason);
      console.log(`Flagged ${contentType} ${contentId}`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  const unflagContent = useCallback(async (contentId: string, contentType: 'Question' | 'Answer') => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for moderation');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.unflagContent(contentId, contentType);
      console.log(`Unflagged ${contentType} ${contentId}`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  // User reputation management
  const adjustUserReputation = useCallback(async (userId: string, adjustment: number, reason: string) => {
    if (!isAdmin()) {
      throw new Error('Insufficient permissions for reputation adjustment');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.adjustUserReputation(userId, adjustment, reason);
      console.log(`Adjusted reputation for user ${userId} by ${adjustment}`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAdmin, handleError]);

  const awardBadge = useCallback(async (userId: string, badgeType: string) => {
    if (!isAdmin()) {
      throw new Error('Insufficient permissions for badge awarding');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.awardBadge(userId, badgeType);
      console.log(`Awarded badge ${badgeType} to user ${userId}`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAdmin, handleError]);

  // User management
  const banUser = useCallback(async (userId: string, duration: number, reason: string) => {
    if (!isAdmin()) {
      throw new Error('Insufficient permissions for user banning');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.banUser(userId, duration, reason);
      console.log(`Banned user ${userId} for ${duration} hours`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAdmin, handleError]);

  const unbanUser = useCallback(async (userId: string) => {
    if (!isAdmin()) {
      throw new Error('Insufficient permissions for user unbanning');
    }

    setLoading(true);
    setError(null);
    
    try {
      await qaService.unbanUser(userId);
      console.log(`Unbanned user ${userId}`);
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [isAdmin, handleError]);

  // Analytics and reporting
  const getQAAnalytics = useCallback(async () => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for analytics');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await qaService.getQAAnalytics();
      if (response.succeeded && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load analytics');
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  const getFlaggedContent = useCallback(async () => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for flagged content');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await qaService.getFlaggedContent();
      if (response.succeeded && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load flagged content');
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  const getModerationActions = useCallback(async (pageNumber?: number, pageSize?: number) => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for moderation actions');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await qaService.getModerationActions(pageNumber, pageSize);
      if (response.succeeded && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load moderation actions');
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  const getUserModerationInfo = useCallback(async (userId: string) => {
    if (!canModerateContent()) {
      throw new Error('Insufficient permissions for user moderation info');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await qaService.getUserModerationInfo(userId);
      if (response.succeeded && response.data) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load user moderation info');
      }
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [canModerateContent, handleError]);

  return {
    // State
    loading,
    error,
    
    // Permissions
    canModerate: canModerateContent(),
    canAdmin: isAdmin(),
    
    // Bulk operations
    bulkDeleteQuestions,
    bulkCloseQuestions,
    bulkDeleteAnswers,
    
    // Content flagging
    flagContent,
    unflagContent,
    
    // User management
    adjustUserReputation,
    awardBadge,
    banUser,
    unbanUser,
    
    // Analytics and reporting
    getQAAnalytics,
    getFlaggedContent,
    getModerationActions,
    getUserModerationInfo,
    
    // Utility
    clearError
  };
};