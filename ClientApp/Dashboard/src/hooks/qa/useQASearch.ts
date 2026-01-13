import { useCallback } from 'react';
import { useQA } from '../../contexts/qa';
import { qaService } from '../../services/qa/QAService';
import type { 
  UseQASearch,
  SearchFilter
} from '../../types/qa/api';

/**
 * QA Search Hook following existing service patterns
 * Provides search functionality for React Dashboard
 * Integrates with QA context and existing authentication
 */
export const useQASearch = (): UseQASearch => {
  const {
    search: searchState,
    performSearch,
    clearSearch
  } = useQA();

  // Search questions specifically
  const searchQuestions = useCallback(async (filter: SearchFilter) => {
    try {
      const response = await qaService.searchQuestions(filter);
      if (response.succeeded && response.data) {
        // Update would be handled by context dispatch if needed
        console.log('Questions search completed:', response.data);
      }
    } catch (error) {
      console.error('Failed to search questions:', error);
    }
  }, []);

  // Search answers specifically
  const searchAnswers = useCallback(async (filter: SearchFilter) => {
    try {
      const response = await qaService.searchAnswers(filter);
      if (response.succeeded && response.data) {
        // Update would be handled by context dispatch if needed
        console.log('Answers search completed:', response.data);
      }
    } catch (error) {
      console.error('Failed to search answers:', error);
    }
  }, []);

  // Get search suggestions
  const getSuggestions = useCallback(async (query: string) => {
    try {
      const response = await qaService.getSearchSuggestions(query);
      if (response.succeeded && response.data) {
        // Update would be handled by context dispatch if needed
        console.log('Search suggestions loaded:', response.data);
      }
    } catch (error) {
      console.error('Failed to get search suggestions:', error);
    }
  }, []);

  // Clear error for search section
  const clearError = useCallback(() => {
    // Error clearing is handled by the context
  }, []);

  return {
    // State
    results: searchState.results,
    suggestions: searchState.suggestions,
    loading: searchState.loading,
    error: searchState.error,
    lastQuery: searchState.lastQuery,
    
    // Actions
    performSearch,
    searchQuestions,
    searchAnswers,
    getSuggestions,
    clearSearch,
    clearError
  };
};