import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { qaService } from '../../services/qa/QAService';
import { createQASignalRService } from '../../services/qa/QASignalRService';
import { useAuth } from '../../hooks/auth/useAuth';
import type { 
  QAState, 
  QAActions,
  QuestionFilter,
  AnswerFilter,
  SearchFilter,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CreateAnswerRequest,
  UpdateAnswerRequest,
  CreateVoteRequest,
  CloseQuestionRequest
} from '../../types/qa/api';

// QA Context Types
interface QAContextType extends QAState, QAActions {
  signalRService: any;
  isConnected: boolean;
}

interface QAProviderProps {
  children: React.ReactNode;
}

// Initial State following existing patterns
const initialState: QAState = {
  questions: {
    items: [],
    currentQuestion: null,
    loading: false,
    error: null,
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    },
    filters: {
      pageNumber: 1,
      pageSize: 10,
      sortBy: 'createdAt',
      sortDirection: 'desc'
    }
  },
  answers: {
    items: [],
    loading: false,
    error: null
  },
  votes: {
    userVotes: {},
    loading: false,
    error: null
  },
  reputation: {
    currentUser: null,
    leaderboard: [],
    history: [],
    loading: false,
    error: null
  },
  categories: [],
  tags: [],
  experts: [],
  search: {
    results: [],
    suggestions: [],
    loading: false,
    error: null,
    lastQuery: ''
  }
};

// Action Types following existing patterns
type QAActionType =
  | { type: 'SET_LOADING'; payload: { section: keyof QAState; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { section: keyof QAState; error: string | null } }
  | { type: 'SET_QUESTIONS'; payload: any }
  | { type: 'SET_CURRENT_QUESTION'; payload: any }
  | { type: 'SET_ANSWERS'; payload: any[] }
  | { type: 'SET_USER_VOTES'; payload: { [contentId: string]: 'Up' | 'Down' } }
  | { type: 'SET_REPUTATION'; payload: any }
  | { type: 'SET_LEADERBOARD'; payload: any[] }
  | { type: 'SET_CATEGORIES'; payload: any[] }
  | { type: 'SET_TAGS'; payload: any[] }
  | { type: 'SET_SEARCH_RESULTS'; payload: any[] }
  | { type: 'SET_FILTERS'; payload: QuestionFilter }
  | { type: 'CLEAR_ERROR'; payload: keyof QAState };

// Reducer following existing patterns
const qaReducer = (state: QAState, action: QAActionType): QAState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          loading: action.payload.loading
        }
      };
    case 'SET_ERROR':
      return {
        ...state,
        [action.payload.section]: {
          ...state[action.payload.section],
          error: action.payload.error
        }
      };

    case 'SET_QUESTIONS':
      return {
        ...state,
        questions: {
          ...state.questions,
          items: action.payload.items || [],
          pagination: action.payload.pagination || state.questions.pagination,
          loading: false,
          error: null
        }
      };

    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        questions: {
          ...state.questions,
          currentQuestion: action.payload,
          loading: false,
          error: null
        }
      };

    case 'SET_ANSWERS':
      return {
        ...state,
        answers: {
          ...state.answers,
          items: action.payload,
          loading: false,
          error: null
        }
      };

    case 'SET_USER_VOTES':
      return {
        ...state,
        votes: {
          ...state.votes,
          userVotes: { ...state.votes.userVotes, ...action.payload },
          loading: false,
          error: null
        }
      };

    case 'SET_REPUTATION':
      return {
        ...state,
        reputation: {
          ...state.reputation,
          currentUser: action.payload,
          loading: false,
          error: null
        }
      };

    case 'SET_LEADERBOARD':
      return {
        ...state,
        reputation: {
          ...state.reputation,
          leaderboard: action.payload,
          loading: false,
          error: null
        }
      };

    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload
      };

    case 'SET_TAGS':
      return {
        ...state,
        tags: action.payload
      };

    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        search: {
          ...state.search,
          results: action.payload,
          loading: false,
          error: null
        }
      };

    case 'SET_FILTERS':
      return {
        ...state,
        questions: {
          ...state.questions,
          filters: action.payload
        }
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        [action.payload]: {
          ...state[action.payload],
          error: null
        }
      };

    default:
      return state;
  }
};

// Create Context
const QAContext = createContext<QAContextType | undefined>(undefined);

// QA Provider Component following existing auth provider patterns
export const QAProvider: React.FC<QAProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(qaReducer, initialState);
  const { user, isAuthenticated } = useAuth();
  
  // Initialize SignalR service following existing patterns
  const signalRService = React.useMemo(() => {
    if (isAuthenticated) {
      return createQASignalRService(() => localStorage.getItem('auth_token'));
    }
    return null;
  }, [isAuthenticated]);

  const [isConnected, setIsConnected] = React.useState(false);

  // Initialize SignalR connection when authenticated
  useEffect(() => {
    if (signalRService && isAuthenticated) {
      signalRService.initialize().then(() => {
        setIsConnected(true);
      }).catch(error => {
        console.error('Failed to initialize QA SignalR service:', error);
      });

      // Set up connection status monitoring
      const unsubscribe = signalRService.onConnectionStatusChange((status) => {
        setIsConnected(status === 'Connected');
      });

      return () => {
        unsubscribe();
        signalRService.disconnect();
      };
    }
  }, [signalRService, isAuthenticated]);

  // Helper function for error handling following existing patterns
  const handleApiError = useCallback((section: keyof QAState, error: any) => {
    const errorMessage = error?.message || error?.toString() || 'An error occurred';
    dispatch({ type: 'SET_ERROR', payload: { section, error: errorMessage } });
    dispatch({ type: 'SET_LOADING', payload: { section, loading: false } });
  }, []);

  // Question Actions following existing service patterns
  const loadQuestions = useCallback(async (filter?: QuestionFilter) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'questions', loading: true } });
    
    try {
      const response = await qaService.getQuestions(filter);
      if (response.succeeded && response.data) {
        dispatch({ 
          type: 'SET_QUESTIONS', 
          payload: {
            items: response.data.items,
            pagination: {
              pageNumber: response.data.pageNumber,
              pageSize: response.data.pageSize,
              totalCount: response.data.totalCount,
              totalPages: response.data.totalPages,
              hasNextPage: response.data.hasNextPage,
              hasPreviousPage: response.data.hasPreviousPage
            }
          }
        });
      } else {
        throw new Error(response.message || 'Failed to load questions');
      }
    } catch (error) {
      handleApiError('questions', error);
    }
  }, [handleApiError]);

  const loadQuestion = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'questions', loading: true } });
    
    try {
      const response = await qaService.getQuestionDetail(id);
      if (response.succeeded && response.data) {
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: response.data });
        
        // Also load answers for this question
        if (response.data.answers) {
          dispatch({ type: 'SET_ANSWERS', payload: response.data.answers });
        }
      } else {
        throw new Error(response.message || 'Failed to load question');
      }
    } catch (error) {
      handleApiError('questions', error);
    }
  }, [handleApiError]);

  const createQuestion = useCallback(async (request: CreateQuestionRequest) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'questions', loading: true } });
    
    try {
      const response = await qaService.createQuestion(request);
      if (response.succeeded) {
        // Reload questions to show the new one
        await loadQuestions(state.questions.filters);
      } else {
        throw new Error(response.message || 'Failed to create question');
      }
    } catch (error) {
      handleApiError('questions', error);
      throw error;
    }
  }, [handleApiError, loadQuestions, state.questions.filters]);

  const updateQuestion = useCallback(async (id: string, request: UpdateQuestionRequest) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'questions', loading: true } });
    
    try {
      const response = await qaService.updateQuestion(id, request);
      if (response.succeeded) {
        // Reload current question if it's the one being updated
        if (state.questions.currentQuestion?.id === id) {
          await loadQuestion(id);
        }
        // Reload questions list
        await loadQuestions(state.questions.filters);
      } else {
        throw new Error(response.message || 'Failed to update question');
      }
    } catch (error) {
      handleApiError('questions', error);
      throw error;
    }
  }, [handleApiError, loadQuestion, loadQuestions, state.questions.currentQuestion?.id, state.questions.filters]);

  const deleteQuestion = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'questions', loading: true } });
    
    try {
      const response = await qaService.deleteQuestion(id);
      if (response.succeeded) {
        // Clear current question if it's the one being deleted
        if (state.questions.currentQuestion?.id === id) {
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: null });
        }
        // Reload questions list
        await loadQuestions(state.questions.filters);
      } else {
        throw new Error(response.message || 'Failed to delete question');
      }
    } catch (error) {
      handleApiError('questions', error);
      throw error;
    }
  }, [handleApiError, loadQuestions, state.questions.currentQuestion?.id, state.questions.filters]);

  const closeQuestion = useCallback(async (id: string, request: CloseQuestionRequest) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'questions', loading: true } });
    
    try {
      const response = await qaService.closeQuestion(id, request);
      if (response.succeeded) {
        // Reload current question if it's the one being closed
        if (state.questions.currentQuestion?.id === id) {
          await loadQuestion(id);
        }
        // Reload questions list
        await loadQuestions(state.questions.filters);
      } else {
        throw new Error(response.message || 'Failed to close question');
      }
    } catch (error) {
      handleApiError('questions', error);
      throw error;
    }
  }, [handleApiError, loadQuestion, loadQuestions, state.questions.currentQuestion?.id, state.questions.filters]);

  // Answer Actions following existing service patterns
  const loadAnswers = useCallback(async (questionId: string, filter?: AnswerFilter) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'answers', loading: true } });
    
    try {
      const response = await qaService.getAnswersByQuestion(questionId, filter);
      if (response.succeeded && response.data) {
        dispatch({ type: 'SET_ANSWERS', payload: response.data.items });
      } else {
        throw new Error(response.message || 'Failed to load answers');
      }
    } catch (error) {
      handleApiError('answers', error);
    }
  }, [handleApiError]);

  const createAnswer = useCallback(async (request: CreateAnswerRequest) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'answers', loading: true } });
    
    try {
      const response = await qaService.createAnswer(request);
      if (response.succeeded) {
        // Reload answers for the question
        await loadAnswers(request.questionId);
        // Reload question to update answer count
        if (state.questions.currentQuestion?.id === request.questionId) {
          await loadQuestion(request.questionId);
        }
      } else {
        throw new Error(response.message || 'Failed to create answer');
      }
    } catch (error) {
      handleApiError('answers', error);
      throw error;
    }
  }, [handleApiError, loadAnswers, loadQuestion, state.questions.currentQuestion?.id]);

  const updateAnswer = useCallback(async (id: string, request: UpdateAnswerRequest) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'answers', loading: true } });
    
    try {
      const response = await qaService.updateAnswer(id, request);
      if (response.succeeded && response.data) {
        // Find the answer in current answers and update it
        const updatedAnswers = state.answers.items.map(answer => 
          answer.id === id ? response.data! : answer
        );
        dispatch({ type: 'SET_ANSWERS', payload: updatedAnswers });
      } else {
        throw new Error(response.message || 'Failed to update answer');
      }
    } catch (error) {
      handleApiError('answers', error);
      throw error;
    }
  }, [handleApiError, state.answers.items]);

  const deleteAnswer = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'answers', loading: true } });
    
    try {
      const response = await qaService.deleteAnswer(id);
      if (response.succeeded) {
        // Remove answer from current answers
        const updatedAnswers = state.answers.items.filter(answer => answer.id !== id);
        dispatch({ type: 'SET_ANSWERS', payload: updatedAnswers });
        
        // Reload current question to update answer count
        if (state.questions.currentQuestion) {
          await loadQuestion(state.questions.currentQuestion.id);
        }
      } else {
        throw new Error(response.message || 'Failed to delete answer');
      }
    } catch (error) {
      handleApiError('answers', error);
      throw error;
    }
  }, [handleApiError, state.answers.items, state.questions.currentQuestion, loadQuestion]);

  const acceptAnswer = useCallback(async (id: string) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'answers', loading: true } });
    
    try {
      const response = await qaService.acceptAnswer(id);
      if (response.succeeded) {
        // Update the accepted answer in current answers
        const updatedAnswers = state.answers.items.map(answer => ({
          ...answer,
          isAccepted: answer.id === id
        }));
        dispatch({ type: 'SET_ANSWERS', payload: updatedAnswers });
        
        // Reload current question to update accepted answer
        if (state.questions.currentQuestion) {
          await loadQuestion(state.questions.currentQuestion.id);
        }
      } else {
        throw new Error(response.message || 'Failed to accept answer');
      }
    } catch (error) {
      handleApiError('answers', error);
      throw error;
    }
  }, [handleApiError, state.answers.items, state.questions.currentQuestion, loadQuestion]);

  // Voting Actions following existing service patterns
  const vote = useCallback(async (request: CreateVoteRequest) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'votes', loading: true } });
    
    try {
      const response = await qaService.createVote(request);
      if (response.succeeded) {
        // Update user votes
        dispatch({ 
          type: 'SET_USER_VOTES', 
          payload: { [request.contentId]: request.voteType } 
        });
        
        // Reload current question/answers to update vote counts
        if (state.questions.currentQuestion) {
          await loadQuestion(state.questions.currentQuestion.id);
        }
      } else {
        throw new Error(response.message || 'Failed to vote');
      }
    } catch (error) {
      handleApiError('votes', error);
      throw error;
    }
  }, [handleApiError, state.questions.currentQuestion, loadQuestion]);

  const removeVote = useCallback(async (contentId: string, contentType: 'Question' | 'Answer') => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'votes', loading: true } });
    
    try {
      const response = await qaService.removeVote(contentId, contentType);
      if (response.succeeded) {
        // Remove vote from user votes
        const updatedVotes = { ...state.votes.userVotes };
        delete updatedVotes[contentId];
        dispatch({ type: 'SET_USER_VOTES', payload: updatedVotes });
        
        // Reload current question/answers to update vote counts
        if (state.questions.currentQuestion) {
          await loadQuestion(state.questions.currentQuestion.id);
        }
      } else {
        throw new Error(response.message || 'Failed to remove vote');
      }
    } catch (error) {
      handleApiError('votes', error);
      throw error;
    }
  }, [handleApiError, state.votes.userVotes, state.questions.currentQuestion, loadQuestion]);

  const changeVote = useCallback(async (contentId: string, contentType: 'Question' | 'Answer', voteType: 'Up' | 'Down') => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'votes', loading: true } });
    
    try {
      const response = await qaService.changeVote(contentId, contentType, voteType);
      if (response.succeeded) {
        // Update user votes
        dispatch({ 
          type: 'SET_USER_VOTES', 
          payload: { [contentId]: voteType } 
        });
        
        // Reload current question/answers to update vote counts
        if (state.questions.currentQuestion) {
          await loadQuestion(state.questions.currentQuestion.id);
        }
      } else {
        throw new Error(response.message || 'Failed to change vote');
      }
    } catch (error) {
      handleApiError('votes', error);
      throw error;
    }
  }, [handleApiError, state.questions.currentQuestion, loadQuestion]);

  // Search Actions following existing service patterns
  const search = useCallback(async (filter: SearchFilter) => {
    dispatch({ type: 'SET_LOADING', payload: { section: 'search', loading: true } });
    
    try {
      const response = await qaService.searchContent(filter);
      if (response.succeeded && response.data) {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: response.data.items });
        // Update last query
        state.search.lastQuery = filter.searchTerm || '';
      } else {
        throw new Error(response.message || 'Search failed');
      }
    } catch (error) {
      handleApiError('search', error);
    }
  }, [handleApiError, state.search]);

  const clearSearch = useCallback(() => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
    state.search.lastQuery = '';
  }, [state.search]);

  // UI Actions following existing patterns
  const setLoading = useCallback((loading: boolean) => {
    // This is a generic loading setter - in practice, specific actions set their own loading
    console.log('Generic setLoading called:', loading);
  }, []);

  const setError = useCallback((error: string | null) => {
    // This is a generic error setter - in practice, specific actions set their own errors
    console.log('Generic setError called:', error);
  }, []);

  const clearError = useCallback(() => {
    // Clear all errors
    Object.keys(state).forEach(section => {
      dispatch({ type: 'CLEAR_ERROR', payload: section as keyof QAState });
    });
  }, [state]);

  // Load initial data when provider mounts
  useEffect(() => {
    if (isAuthenticated) {
      // Load categories and tags
      qaService.getCategories().then(response => {
        if (response.succeeded && response.data) {
          dispatch({ type: 'SET_CATEGORIES', payload: response.data });
        }
      });

      qaService.getTags().then(response => {
        if (response.succeeded && response.data) {
          dispatch({ type: 'SET_TAGS', payload: response.data });
        }
      });

      // Load initial questions
      loadQuestions();
    }
  }, [isAuthenticated, loadQuestions]);

  // Context value following existing patterns
  const value: QAContextType = {
    // State
    ...state,
    
    // Actions
    loadQuestions,
    loadQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    closeQuestion,
    loadAnswers,
    createAnswer,
    updateAnswer,
    deleteAnswer,
    acceptAnswer,
    vote,
    removeVote,
    changeVote,
    search,
    clearSearch,
    setLoading,
    setError,
    clearError,
    
    // SignalR
    signalRService,
    isConnected
  };

  return (
    <QAContext.Provider value={value}>
      {children}
    </QAContext.Provider>
  );
};

// Custom hook to use QA context following existing patterns
export const useQA = (): QAContextType => {
  const context = useContext(QAContext);
  if (context === undefined) {
    throw new Error('useQA must be used within a QAProvider');
  }
  return context;
};

// Export context for advanced usage
export { QAContext };