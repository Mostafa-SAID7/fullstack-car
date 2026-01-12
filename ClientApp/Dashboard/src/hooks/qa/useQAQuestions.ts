import { useCallback } from 'react';
import { useQA } from '../../contexts/qa';
import type { 
  UseQAQuestions,
  QuestionFilter,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CloseQuestionRequest
} from '../../types/qa/api';

/**
 * QA Questions Hook following existing service patterns
 * Provides question management functionality for React Dashboard
 * Integrates with QA context and existing authentication
 */
export const useQAQuestions = (): UseQAQuestions => {
  const {
    questions,
    loadQuestions,
    loadQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    closeQuestion
  } = useQA();

  // Set filters with automatic reload
  const setFilters = useCallback((filters: QuestionFilter) => {
    loadQuestions(filters);
  }, [loadQuestions]);

  // Clear error for questions section
  const clearError = useCallback(() => {
    // Error clearing is handled by the context
  }, []);

  return {
    // State
    questions: questions.items,
    currentQuestion: questions.currentQuestion,
    loading: questions.loading,
    error: questions.error,
    pagination: questions.pagination,
    filters: questions.filters,
    
    // Actions
    loadQuestions,
    loadQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    closeQuestion,
    setFilters,
    clearError
  };
};