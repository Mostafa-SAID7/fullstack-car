import { useCallback } from 'react';
import { useQA } from '../../contexts/qa';
import type { 
  UseQAAnswers
} from '../../types/qa/api';

/**
 * QA Answers Hook following existing service patterns
 * Provides answer management functionality for React Dashboard
 * Integrates with QA context and existing authentication
 */
export const useQAAnswers = (): UseQAAnswers => {
  const {
    answers,
    loadAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    acceptAnswer
  } = useQA();

  // Clear error for answers section
  const clearError = useCallback(() => {
    // Error clearing is handled by the context
  }, []);

  return {
    // State
    answers: answers.items,
    loading: answers.loading,
    error: answers.error,
    
    // Actions
    loadAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    acceptAnswer,
    clearError
  };
};