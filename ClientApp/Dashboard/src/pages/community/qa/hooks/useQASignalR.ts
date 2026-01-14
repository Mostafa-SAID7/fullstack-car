import { useCallback } from 'react';
import { useQA } from '../../contexts/qa';
import { useAuth } from '../auth/useAuth';

/**
 * QA SignalR Hook following existing service patterns
 * Provides real-time functionality for React Dashboard
 * Integrates with QA context and existing authentication
 */
export const useQASignalR = () => {
  const { signalRService, isConnected } = useQA();
  const { user } = useAuth();

  // Connection management
  const connect = useCallback(async () => {
    if (signalRService && user) {
      try {
        await signalRService.initialize();
      } catch (error) {
        console.error('Failed to connect QA SignalR:', error);
      }
    }
  }, [signalRService, user]);

  const disconnect = useCallback(async () => {
    if (signalRService) {
      try {
        await signalRService.disconnect();
      } catch (error) {
        console.error('Failed to disconnect QA SignalR:', error);
      }
    }
  }, [signalRService]);

  // Group management for dashboard features
  const joinModeratorsGroup = useCallback(async () => {
    if (signalRService && isConnected) {
      try {
        await signalRService.joinModeratorsGroup();
      } catch (error) {
        console.error('Failed to join moderators group:', error);
      }
    }
  }, [signalRService, isConnected]);

  const leaveModeratorsGroup = useCallback(async () => {
    if (signalRService && isConnected) {
      try {
        await signalRService.leaveModeratorsGroup();
      } catch (error) {
        console.error('Failed to leave moderators group:', error);
      }
    }
  }, [signalRService, isConnected]);

  const joinExpertsGroup = useCallback(async () => {
    if (signalRService && isConnected) {
      try {
        await signalRService.joinExpertsGroup();
      } catch (error) {
        console.error('Failed to join experts group:', error);
      }
    }
  }, [signalRService, isConnected]);

  const leaveExpertsGroup = useCallback(async () => {
    if (signalRService && isConnected) {
      try {
        await signalRService.leaveExpertsGroup();
      } catch (error) {
        console.error('Failed to leave experts group:', error);
      }
    }
  }, [signalRService, isConnected]);

  // Category-specific groups
  const joinCategoryGroup = useCallback(async (category: string) => {
    if (signalRService && isConnected) {
      try {
        await signalRService.joinCategoryGroup(category);
      } catch (error) {
        console.error(`Failed to join category group ${category}:`, error);
      }
    }
  }, [signalRService, isConnected]);

  const leaveCategoryGroup = useCallback(async (category: string) => {
    if (signalRService && isConnected) {
      try {
        await signalRService.leaveCategoryGroup(category);
      } catch (error) {
        console.error(`Failed to leave category group ${category}:`, error);
      }
    }
  }, [signalRService, isConnected]);

  // Question-specific groups
  const joinQuestionGroup = useCallback(async (questionId: string) => {
    if (signalRService && isConnected) {
      try {
        await signalRService.joinQuestionGroup(questionId);
      } catch (error) {
        console.error(`Failed to join question group ${questionId}:`, error);
      }
    }
  }, [signalRService, isConnected]);

  const leaveQuestionGroup = useCallback(async (questionId: string) => {
    if (signalRService && isConnected) {
      try {
        await signalRService.leaveQuestionGroup(questionId);
      } catch (error) {
        console.error(`Failed to leave question group ${questionId}:`, error);
      }
    }
  }, [signalRService, isConnected]);

  // Event subscriptions
  const subscribeToNewAnswers = useCallback((callback: (data: any) => void) => {
    if (signalRService) {
      return signalRService.onNewAnswer(callback);
    }
    return () => {};
  }, [signalRService]);

  const subscribeToVoteUpdates = useCallback((callback: (data: any) => void) => {
    if (signalRService) {
      return signalRService.onVoteUpdate(callback);
    }
    return () => {};
  }, [signalRService]);

  const subscribeToQuestionUpdates = useCallback((callback: (data: any) => void) => {
    if (signalRService) {
      return signalRService.onQuestionUpdate(callback);
    }
    return () => {};
  }, [signalRService]);

  const subscribeToAnswerAccepted = useCallback((callback: (data: any) => void) => {
    if (signalRService) {
      return signalRService.onAnswerAccepted(callback);
    }
    return () => {};
  }, [signalRService]);

  const subscribeToReputationUpdates = useCallback((callback: (data: any) => void) => {
    if (signalRService) {
      return signalRService.onReputationUpdate(callback);
    }
    return () => {};
  }, [signalRService]);

  const subscribeToQuestionClosed = useCallback((callback: (data: any) => void) => {
    if (signalRService) {
      return signalRService.onQuestionClosed(callback);
    }
    return () => {};
  }, [signalRService]);

  const subscribeToExpertNotifications = useCallback((callback: (data: any) => void) => {
    if (signalRService) {
      return signalRService.onExpertNotification(callback);
    }
    return () => {};
  }, [signalRService]);

  // Health monitoring
  const getConnectionHealth = useCallback(async () => {
    if (signalRService) {
      try {
        return await signalRService.getConnectionHealth();
      } catch (error) {
        console.error('Failed to get connection health:', error);
        return null;
      }
    }
    return null;
  }, [signalRService]);

  const testConnection = useCallback(async () => {
    if (signalRService) {
      try {
        return await signalRService.testConnection();
      } catch (error) {
        console.error('Connection test failed:', error);
        return false;
      }
    }
    return false;
  }, [signalRService]);

  return {
    // Connection state
    isConnected,
    service: signalRService,
    
    // Connection management
    connect,
    disconnect,
    
    // Group management
    joinModeratorsGroup,
    leaveModeratorsGroup,
    joinExpertsGroup,
    leaveExpertsGroup,
    joinCategoryGroup,
    leaveCategoryGroup,
    joinQuestionGroup,
    leaveQuestionGroup,
    
    // Event subscriptions
    subscribeToNewAnswers,
    subscribeToVoteUpdates,
    subscribeToQuestionUpdates,
    subscribeToAnswerAccepted,
    subscribeToReputationUpdates,
    subscribeToQuestionClosed,
    subscribeToExpertNotifications,
    
    // Health monitoring
    getConnectionHealth,
    testConnection
  };
};