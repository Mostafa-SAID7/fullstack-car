import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

// Import QA types
import type {
  QuestionList,
  QuestionDetail,
  Answer,
  UserReputation,
  Category,
  Tag,
  PopularTag,
  QuestionFilter,
  AnswerFilter,
  SearchFilter,
  PaginatedResponse
} from '../../../shared/types/qa-api.types';

// State interfaces following existing patterns
export interface QAQuestionState {
  items: QuestionList[];
  currentQuestion: QuestionDetail | null;
  loading: boolean;
  error: string | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: QuestionFilter;
}

export interface QAAnswerState {
  items: Answer[];
  loading: boolean;
  error: string | null;
  pagination: {
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface QAVoteState {
  userVotes: { [contentId: string]: 'Up' | 'Down' };
  loading: boolean;
  error: string | null;
}

export interface QAReputationState {
  currentUser: UserReputation | null;
  leaderboard: UserReputation[];
  loading: boolean;
  error: string | null;
}

export interface QASearchState {
  results: QuestionList[];
  suggestions: string[];
  loading: boolean;
  error: string | null;
  lastQuery: string;
  filters: SearchFilter;
}

export interface QAMetadataState {
  categories: Category[];
  tags: Tag[];
  popularTags: PopularTag[];
  loading: boolean;
  error: string | null;
}

export interface QARealtimeState {
  isConnected: boolean;
  isReconnecting: boolean;
  joinedQuestions: string[];
  joinedCategories: string[];
  typingUsers: { [questionId: string]: string[] };
}

export interface QAGlobalState {
  questions: QAQuestionState;
  answers: QAAnswerState;
  votes: QAVoteState;
  reputation: QAReputationState;
  search: QASearchState;
  metadata: QAMetadataState;
  realtime: QARealtimeState;
}

@Injectable({
  providedIn: 'root'
})
export class QAStateService {
  // Initial state following existing patterns
  private readonly initialQuestionState: QAQuestionState = {
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
      hasPreviousPage: false
    },
    filters: {}
  };

  private readonly initialAnswerState: QAAnswerState = {
    items: [],
    loading: false,
    error: null,
    pagination: {
      pageNumber: 1,
      pageSize: 10,
      totalCount: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false
    }
  };

  private readonly initialVoteState: QAVoteState = {
    userVotes: {},
    loading: false,
    error: null
  };

  private readonly initialReputationState: QAReputationState = {
    currentUser: null,
    leaderboard: [],
    loading: false,
    error: null
  };

  private readonly initialSearchState: QASearchState = {
    results: [],
    suggestions: [],
    loading: false,
    error: null,
    lastQuery: '',
    filters: {}
  };

  private readonly initialMetadataState: QAMetadataState = {
    categories: [],
    tags: [],
    popularTags: [],
    loading: false,
    error: null
  };

  private readonly initialRealtimeState: QARealtimeState = {
    isConnected: false,
    isReconnecting: false,
    joinedQuestions: [],
    joinedCategories: [],
    typingUsers: {}
  };

  // State subjects using BehaviorSubject (following existing patterns)
  private questionsStateSubject = new BehaviorSubject<QAQuestionState>(this.initialQuestionState);
  private answersStateSubject = new BehaviorSubject<QAAnswerState>(this.initialAnswerState);
  private votesStateSubject = new BehaviorSubject<QAVoteState>(this.initialVoteState);
  private reputationStateSubject = new BehaviorSubject<QAReputationState>(this.initialReputationState);
  private searchStateSubject = new BehaviorSubject<QASearchState>(this.initialSearchState);
  private metadataStateSubject = new BehaviorSubject<QAMetadataState>(this.initialMetadataState);
  private realtimeStateSubject = new BehaviorSubject<QARealtimeState>(this.initialRealtimeState);

  // Public observables (following existing service patterns)
  public questionsState$ = this.questionsStateSubject.asObservable();
  public answersState$ = this.answersStateSubject.asObservable();
  public votesState$ = this.votesStateSubject.asObservable();
  public reputationState$ = this.reputationStateSubject.asObservable();
  public searchState$ = this.searchStateSubject.asObservable();
  public metadataState$ = this.metadataStateSubject.asObservable();
  public realtimeState$ = this.realtimeStateSubject.asObservable();

  // Computed observables for common use cases
  public questions$ = this.questionsState$.pipe(
    map(state => state.items),
    distinctUntilChanged()
  );

  public currentQuestion$ = this.questionsState$.pipe(
    map(state => state.currentQuestion),
    distinctUntilChanged()
  );

  public answers$ = this.answersState$.pipe(
    map(state => state.items),
    distinctUntilChanged()
  );

  public userVotes$ = this.votesState$.pipe(
    map(state => state.userVotes),
    distinctUntilChanged()
  );

  public userReputation$ = this.reputationState$.pipe(
    map(state => state.currentUser),
    distinctUntilChanged()
  );

  public loading$ = combineLatest([
    this.questionsState$,
    this.answersState$,
    this.votesState$,
    this.reputationState$,
    this.searchState$,
    this.metadataState$
  ]).pipe(
    map(([questions, answers, votes, reputation, search, metadata]) => 
      questions.loading || answers.loading || votes.loading || 
      reputation.loading || search.loading || metadata.loading
    ),
    distinctUntilChanged()
  );

  public error$ = combineLatest([
    this.questionsState$,
    this.answersState$,
    this.votesState$,
    this.reputationState$,
    this.searchState$,
    this.metadataState$
  ]).pipe(
    map(([questions, answers, votes, reputation, search, metadata]) => 
      questions.error || answers.error || votes.error || 
      reputation.error || search.error || metadata.error
    ),
    distinctUntilChanged()
  );

  public isConnected$ = this.realtimeState$.pipe(
    map(state => state.isConnected),
    distinctUntilChanged()
  );

  // Global state observable
  public globalState$: Observable<QAGlobalState> = combineLatest([
    this.questionsState$,
    this.answersState$,
    this.votesState$,
    this.reputationState$,
    this.searchState$,
    this.metadataState$,
    this.realtimeState$
  ]).pipe(
    map(([questions, answers, votes, reputation, search, metadata, realtime]) => ({
      questions,
      answers,
      votes,
      reputation,
      search,
      metadata,
      realtime
    }))
  );

  constructor() {}

  // Questions state management methods
  setQuestions(questions: QuestionList[], pagination?: Partial<QAQuestionState['pagination']>): void {
    const currentState = this.questionsStateSubject.value;
    this.questionsStateSubject.next({
      ...currentState,
      items: questions,
      pagination: pagination ? { ...currentState.pagination, ...pagination } : currentState.pagination,
      loading: false,
      error: null
    });
  }

  setCurrentQuestion(question: QuestionDetail | null): void {
    const currentState = this.questionsStateSubject.value;
    this.questionsStateSubject.next({
      ...currentState,
      currentQuestion: question,
      loading: false,
      error: null
    });
  }

  addQuestion(question: QuestionList): void {
    const currentState = this.questionsStateSubject.value;
    this.questionsStateSubject.next({
      ...currentState,
      items: [question, ...currentState.items],
      pagination: {
        ...currentState.pagination,
        totalCount: currentState.pagination.totalCount + 1
      }
    });
  }

  updateQuestion(questionId: string, updates: Partial<QuestionList>): void {
    const currentState = this.questionsStateSubject.value;
    const updatedItems = currentState.items.map(q => 
      q.id === questionId ? { ...q, ...updates } : q
    );
    
    this.questionsStateSubject.next({
      ...currentState,
      items: updatedItems,
      currentQuestion: currentState.currentQuestion?.id === questionId 
        ? { ...currentState.currentQuestion, ...updates }
        : currentState.currentQuestion
    });
  }

  removeQuestion(questionId: string): void {
    const currentState = this.questionsStateSubject.value;
    const updatedItems = currentState.items.filter(q => q.id !== questionId);
    
    this.questionsStateSubject.next({
      ...currentState,
      items: updatedItems,
      currentQuestion: currentState.currentQuestion?.id === questionId 
        ? null 
        : currentState.currentQuestion,
      pagination: {
        ...currentState.pagination,
        totalCount: Math.max(0, currentState.pagination.totalCount - 1)
      }
    });
  }

  setQuestionsLoading(loading: boolean): void {
    const currentState = this.questionsStateSubject.value;
    this.questionsStateSubject.next({
      ...currentState,
      loading
    });
  }

  setQuestionsError(error: string | null): void {
    const currentState = this.questionsStateSubject.value;
    this.questionsStateSubject.next({
      ...currentState,
      error,
      loading: false
    });
  }

  setQuestionsFilters(filters: QuestionFilter): void {
    const currentState = this.questionsStateSubject.value;
    this.questionsStateSubject.next({
      ...currentState,
      filters
    });
  }

  // Answers state management methods
  setAnswers(answers: Answer[], pagination?: Partial<QAAnswerState['pagination']>): void {
    const currentState = this.answersStateSubject.value;
    this.answersStateSubject.next({
      ...currentState,
      items: answers,
      pagination: pagination ? { ...currentState.pagination, ...pagination } : currentState.pagination,
      loading: false,
      error: null
    });
  }

  addAnswer(answer: Answer): void {
    const currentState = this.answersStateSubject.value;
    this.answersStateSubject.next({
      ...currentState,
      items: [...currentState.items, answer],
      pagination: {
        ...currentState.pagination,
        totalCount: currentState.pagination.totalCount + 1
      }
    });

    // Also update the current question's answer count
    const questionState = this.questionsStateSubject.value;
    if (questionState.currentQuestion && questionState.currentQuestion.id === answer.questionId) {
      this.questionsStateSubject.next({
        ...questionState,
        currentQuestion: {
          ...questionState.currentQuestion,
          answerCount: questionState.currentQuestion.answerCount + 1,
          answers: [...(questionState.currentQuestion.answers || []), answer]
        }
      });
    }
  }

  updateAnswer(answerId: string, updates: Partial<Answer>): void {
    const currentState = this.answersStateSubject.value;
    const updatedItems = currentState.items.map(a => 
      a.id === answerId ? { ...a, ...updates } : a
    );
    
    this.answersStateSubject.next({
      ...currentState,
      items: updatedItems
    });

    // Also update in current question if present
    const questionState = this.questionsStateSubject.value;
    if (questionState.currentQuestion && questionState.currentQuestion.answers) {
      const updatedQuestionAnswers = questionState.currentQuestion.answers.map(a => 
        a.id === answerId ? { ...a, ...updates } : a
      );
      
      this.questionsStateSubject.next({
        ...questionState,
        currentQuestion: {
          ...questionState.currentQuestion,
          answers: updatedQuestionAnswers
        }
      });
    }
  }

  removeAnswer(answerId: string): void {
    const currentState = this.answersStateSubject.value;
    const removedAnswer = currentState.items.find(a => a.id === answerId);
    const updatedItems = currentState.items.filter(a => a.id !== answerId);
    
    this.answersStateSubject.next({
      ...currentState,
      items: updatedItems,
      pagination: {
        ...currentState.pagination,
        totalCount: Math.max(0, currentState.pagination.totalCount - 1)
      }
    });

    // Also update current question
    if (removedAnswer) {
      const questionState = this.questionsStateSubject.value;
      if (questionState.currentQuestion && questionState.currentQuestion.id === removedAnswer.questionId) {
        const updatedAnswers = questionState.currentQuestion.answers?.filter(a => a.id !== answerId) || [];
        
        this.questionsStateSubject.next({
          ...questionState,
          currentQuestion: {
            ...questionState.currentQuestion,
            answerCount: Math.max(0, questionState.currentQuestion.answerCount - 1),
            answers: updatedAnswers
          }
        });
      }
    }
  }

  setAnswersLoading(loading: boolean): void {
    const currentState = this.answersStateSubject.value;
    this.answersStateSubject.next({
      ...currentState,
      loading
    });
  }

  setAnswersError(error: string | null): void {
    const currentState = this.answersStateSubject.value;
    this.answersStateSubject.next({
      ...currentState,
      error,
      loading: false
    });
  }

  // Votes state management methods
  setUserVotes(votes: { [contentId: string]: 'Up' | 'Down' }): void {
    const currentState = this.votesStateSubject.value;
    this.votesStateSubject.next({
      ...currentState,
      userVotes: votes,
      loading: false,
      error: null
    });
  }

  setUserVote(contentId: string, voteType: 'Up' | 'Down' | null): void {
    const currentState = this.votesStateSubject.value;
    const updatedVotes = { ...currentState.userVotes };
    
    if (voteType === null) {
      delete updatedVotes[contentId];
    } else {
      updatedVotes[contentId] = voteType;
    }
    
    this.votesStateSubject.next({
      ...currentState,
      userVotes: updatedVotes
    });
  }

  setVotesLoading(loading: boolean): void {
    const currentState = this.votesStateSubject.value;
    this.votesStateSubject.next({
      ...currentState,
      loading
    });
  }

  setVotesError(error: string | null): void {
    const currentState = this.votesStateSubject.value;
    this.votesStateSubject.next({
      ...currentState,
      error,
      loading: false
    });
  }

  // Reputation state management methods
  setUserReputation(reputation: UserReputation | null): void {
    const currentState = this.reputationStateSubject.value;
    this.reputationStateSubject.next({
      ...currentState,
      currentUser: reputation,
      loading: false,
      error: null
    });
  }

  setReputationLeaderboard(leaderboard: UserReputation[]): void {
    const currentState = this.reputationStateSubject.value;
    this.reputationStateSubject.next({
      ...currentState,
      leaderboard,
      loading: false,
      error: null
    });
  }

  setReputationLoading(loading: boolean): void {
    const currentState = this.reputationStateSubject.value;
    this.reputationStateSubject.next({
      ...currentState,
      loading
    });
  }

  setReputationError(error: string | null): void {
    const currentState = this.reputationStateSubject.value;
    this.reputationStateSubject.next({
      ...currentState,
      error,
      loading: false
    });
  }

  // Search state management methods
  setSearchResults(results: QuestionList[], query: string, filters: SearchFilter): void {
    const currentState = this.searchStateSubject.value;
    this.searchStateSubject.next({
      ...currentState,
      results,
      lastQuery: query,
      filters,
      loading: false,
      error: null
    });
  }

  setSearchSuggestions(suggestions: string[]): void {
    const currentState = this.searchStateSubject.value;
    this.searchStateSubject.next({
      ...currentState,
      suggestions
    });
  }

  setSearchLoading(loading: boolean): void {
    const currentState = this.searchStateSubject.value;
    this.searchStateSubject.next({
      ...currentState,
      loading
    });
  }

  setSearchError(error: string | null): void {
    const currentState = this.searchStateSubject.value;
    this.searchStateSubject.next({
      ...currentState,
      error,
      loading: false
    });
  }

  clearSearch(): void {
    this.searchStateSubject.next(this.initialSearchState);
  }

  // Metadata state management methods
  setCategories(categories: Category[]): void {
    const currentState = this.metadataStateSubject.value;
    this.metadataStateSubject.next({
      ...currentState,
      categories,
      loading: false,
      error: null
    });
  }

  setTags(tags: Tag[]): void {
    const currentState = this.metadataStateSubject.value;
    this.metadataStateSubject.next({
      ...currentState,
      tags,
      loading: false,
      error: null
    });
  }

  setPopularTags(popularTags: PopularTag[]): void {
    const currentState = this.metadataStateSubject.value;
    this.metadataStateSubject.next({
      ...currentState,
      popularTags,
      loading: false,
      error: null
    });
  }

  setMetadataLoading(loading: boolean): void {
    const currentState = this.metadataStateSubject.value;
    this.metadataStateSubject.next({
      ...currentState,
      loading
    });
  }

  setMetadataError(error: string | null): void {
    const currentState = this.metadataStateSubject.value;
    this.metadataStateSubject.next({
      ...currentState,
      error,
      loading: false
    });
  }

  // Realtime state management methods
  setRealtimeConnection(isConnected: boolean, isReconnecting: boolean = false): void {
    const currentState = this.realtimeStateSubject.value;
    this.realtimeStateSubject.next({
      ...currentState,
      isConnected,
      isReconnecting
    });
  }

  setJoinedQuestions(questionIds: string[]): void {
    const currentState = this.realtimeStateSubject.value;
    this.realtimeStateSubject.next({
      ...currentState,
      joinedQuestions: questionIds
    });
  }

  addJoinedQuestion(questionId: string): void {
    const currentState = this.realtimeStateSubject.value;
    if (!currentState.joinedQuestions.includes(questionId)) {
      this.realtimeStateSubject.next({
        ...currentState,
        joinedQuestions: [...currentState.joinedQuestions, questionId]
      });
    }
  }

  removeJoinedQuestion(questionId: string): void {
    const currentState = this.realtimeStateSubject.value;
    this.realtimeStateSubject.next({
      ...currentState,
      joinedQuestions: currentState.joinedQuestions.filter(id => id !== questionId)
    });
  }

  setJoinedCategories(categories: string[]): void {
    const currentState = this.realtimeStateSubject.value;
    this.realtimeStateSubject.next({
      ...currentState,
      joinedCategories: categories
    });
  }

  addJoinedCategory(category: string): void {
    const currentState = this.realtimeStateSubject.value;
    if (!currentState.joinedCategories.includes(category)) {
      this.realtimeStateSubject.next({
        ...currentState,
        joinedCategories: [...currentState.joinedCategories, category]
      });
    }
  }

  removeJoinedCategory(category: string): void {
    const currentState = this.realtimeStateSubject.value;
    this.realtimeStateSubject.next({
      ...currentState,
      joinedCategories: currentState.joinedCategories.filter(c => c !== category)
    });
  }

  setTypingUsers(questionId: string, users: string[]): void {
    const currentState = this.realtimeStateSubject.value;
    this.realtimeStateSubject.next({
      ...currentState,
      typingUsers: {
        ...currentState.typingUsers,
        [questionId]: users
      }
    });
  }

  addTypingUser(questionId: string, userId: string): void {
    const currentState = this.realtimeStateSubject.value;
    const currentUsers = currentState.typingUsers[questionId] || [];
    if (!currentUsers.includes(userId)) {
      this.realtimeStateSubject.next({
        ...currentState,
        typingUsers: {
          ...currentState.typingUsers,
          [questionId]: [...currentUsers, userId]
        }
      });
    }
  }

  removeTypingUser(questionId: string, userId: string): void {
    const currentState = this.realtimeStateSubject.value;
    const currentUsers = currentState.typingUsers[questionId] || [];
    this.realtimeStateSubject.next({
      ...currentState,
      typingUsers: {
        ...currentState.typingUsers,
        [questionId]: currentUsers.filter(id => id !== userId)
      }
    });
  }

  // Utility methods for getting current state values (following existing patterns)
  get currentQuestionsState(): QAQuestionState {
    return this.questionsStateSubject.value;
  }

  get currentAnswersState(): QAAnswerState {
    return this.answersStateSubject.value;
  }

  get currentVotesState(): QAVoteState {
    return this.votesStateSubject.value;
  }

  get currentReputationState(): QAReputationState {
    return this.reputationStateSubject.value;
  }

  get currentSearchState(): QASearchState {
    return this.searchStateSubject.value;
  }

  get currentMetadataState(): QAMetadataState {
    return this.metadataStateSubject.value;
  }

  get currentRealtimeState(): QARealtimeState {
    return this.realtimeStateSubject.value;
  }

  get currentGlobalState(): QAGlobalState {
    return {
      questions: this.currentQuestionsState,
      answers: this.currentAnswersState,
      votes: this.currentVotesState,
      reputation: this.currentReputationState,
      search: this.currentSearchState,
      metadata: this.currentMetadataState,
      realtime: this.currentRealtimeState
    };
  }

  // Reset methods
  resetQuestionsState(): void {
    this.questionsStateSubject.next(this.initialQuestionState);
  }

  resetAnswersState(): void {
    this.answersStateSubject.next(this.initialAnswerState);
  }

  resetVotesState(): void {
    this.votesStateSubject.next(this.initialVoteState);
  }

  resetReputationState(): void {
    this.reputationStateSubject.next(this.initialReputationState);
  }

  resetSearchState(): void {
    this.searchStateSubject.next(this.initialSearchState);
  }

  resetMetadataState(): void {
    this.metadataStateSubject.next(this.initialMetadataState);
  }

  resetRealtimeState(): void {
    this.realtimeStateSubject.next(this.initialRealtimeState);
  }

  resetAllState(): void {
    this.resetQuestionsState();
    this.resetAnswersState();
    this.resetVotesState();
    this.resetReputationState();
    this.resetSearchState();
    this.resetMetadataState();
    this.resetRealtimeState();
  }
}