import { useCallback } from 'react';
import { useQA } from '../../contexts/qa';
import { qaService } from '../../services/qa/QAService';
import type { 
  UseQAVoting,
  VoteFilter,
  CreateVoteRequest
} from '../../types/qa/api';

/**
 * QA Voting Hook following existing service patterns
 * Provides voting functionality for React Dashboard
 * Integrates with QA context and existing authentication
 */
export const useQAVoting = (): UseQAVoting => {
  const {
    votes,
    vote,
    removeVote,
    changeVote
  } = useQA();

  // Get user votes with filter
  const getUserVotes = useCallback(async (filter?: VoteFilter) => {
    try {
      const response = await qaService.getUserVotes(filter);
      if (response.succeeded && response.data) {
        // Convert votes array to userVotes object format
        const userVotesMap: { [contentId: string]: 'Up' | 'Down' } = {};
        response.data.items.forEach(vote => {
          userVotesMap[vote.contentId] = vote.voteType;
        });
        // Update would be handled by context if needed
      }
    } catch (error) {
      console.error('Failed to load user votes:', error);
    }
  }, []);

  // Clear error for votes section
  const clearError = useCallback(() => {
    // Error clearing is handled by the context
  }, []);

  return {
    // State
    userVotes: votes.userVotes,
    loading: votes.loading,
    error: votes.error,
    
    // Actions
    vote,
    removeVote,
    changeVote,
    getUserVotes,
    clearError
  };
};