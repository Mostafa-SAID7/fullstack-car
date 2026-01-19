import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, combineLatest } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
// Removed legacy models import
// import { Question, Answer, CreateQuestionRequest, CreateAnswerRequest, QuestionStatus, QuestionPriority } from '../models/qa.model';
import { Result, PaginatedResult } from '../../../../core/models/result.model';
import { AuthService } from '../../../../core/services/auth.service';
import { HttpClientService } from '../../../../core/services/http-client.service';
import { ToastService } from '../../../../core/services/toast.service';
import { LoadingService } from '../../../../shared/services/loading/loading.service';

// Import the specialized QA services
import { QAQuestionService } from './qa-question.service';
import { QAAnswerService } from './qa-answer.service';
import { QAVotingService } from './qa-voting.service';
import { QAReputationService } from './qa-reputation.service';
import { QASearchService } from './qa-search.service';
import { QASignalRService } from './qa-signalr.service';

// Import types
import {
    QuestionList,
    QuestionDetail,
    UserReputation,
    QuestionFilter,
    AnswerFilter,
    SearchFilter,
    Vote,
    Question,
    Answer,
    CreateQuestionRequest,
    CreateAnswerRequest,
    ApiResponse,
    PaginatedResponse,
    QuestionDetailResponse,
    AnswerResponse,
    QA_API_ENDPOINTS
} from '../models/qa-api.types';

@Injectable({
    providedIn: 'root'
})
export class QAService {
    private readonly apiBase = environment.apiUrl.replace(/\/api\/?$/, '');
    private readonly apiUrl = `${this.apiBase}${QA_API_ENDPOINTS.QUESTIONS.BASE}`;

    // State management using BehaviorSubjects (following existing patterns)
    private questionsSubject = new BehaviorSubject<QuestionList[]>([]);
    private currentQuestionSubject = new BehaviorSubject<QuestionDetail | null>(null);
    private answersSubject = new BehaviorSubject<Answer[]>([]);
    private userReputationSubject = new BehaviorSubject<UserReputation | null>(null);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);
    private userVotesSubject = new BehaviorSubject<{ [contentId: string]: 'Up' | 'Down' }>({});

    // Public observables
    public questions$ = this.questionsSubject.asObservable();
    public currentQuestion$ = this.currentQuestionSubject.asObservable();
    public answers$ = this.answersSubject.asObservable();
    public userReputation$ = this.userReputationSubject.asObservable();
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public userVotes$ = this.userVotesSubject.asObservable();

    constructor(
        private http: HttpClient,
        private httpClient: HttpClientService,
        private authService: AuthService,
        private qaQuestionService: QAQuestionService,
        private qaAnswerService: QAAnswerService,
        private qaVotingService: QAVotingService,
        private qaReputationService: QAReputationService,
        private qaSearchService: QASearchService,
        private qaSignalRService: QASignalRService,
        private toastService: ToastService,
        private loadingService: LoadingService
    ) {
        this.initializeRealtimeUpdates();
        this.loadUserData();
    }

    // Enhanced methods using specialized services and state management
    getQuestions(pageNumber: number = 1, pageSize: number = 10, searchTerm?: string, sortBy?: string, groupId?: string): Observable<PaginatedResponse<QuestionList>> {
        this.loadingService.show();
        this.clearError();

        const filter: QuestionFilter = {
            pageNumber,
            pageSize,
            searchTerm,
            sortBy
        };

        return this.qaQuestionService.getQuestions(filter).pipe(
            map(response => {
                if (response.succeeded && response.data) {
                    // Update state with new questions
                    this.questionsSubject.next(response.data.items);
                    return response.data;
                }
                throw new Error(response.message || 'Failed to load questions');
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    getQuestion(id: string): Observable<QuestionDetailResponse> {
        this.loadingService.show();
        this.clearError();

        return this.qaQuestionService.getQuestionDetail(id).pipe(
            tap(response => {
                if (response.succeeded && response.data) {
                    // Update current question state
                    this.currentQuestionSubject.next(response.data);
                    if (response.data.answers) {
                        this.answersSubject.next(response.data.answers);
                    }

                    // Join question room for real-time updates
                    this.qaSignalRService.joinQuestion(id).catch(error => {
                        console.warn('Failed to join question room:', error);
                    });
                }
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    askQuestion(request: CreateQuestionRequest): Observable<ApiResponse<Question>> {
        this.loadingService.show();
        this.clearError();

        return this.qaQuestionService.createQuestion(request).pipe(
            map(response => {
                if (response.succeeded && response.data) {
                    // Add to questions list - convert to QuestionList format
                    const currentQuestions = this.questionsSubject.value;
                    const questionListItem: QuestionList = {
                        id: response.data.id,
                        title: response.data.title,
                        category: response.data.category,
                        tags: response.data.tags,
                        viewCount: response.data.viewCount || 0,
                        voteScore: response.data.voteScore,
                        answerCount: response.data.answerCount,
                        hasAcceptedAnswer: !!response.data.acceptedAnswerId,
                        isClosed: response.data.isClosed,
                        userId: response.data.userId,
                        userName: response.data.userName,
                        userReputation: response.data.userReputation,
                        createdAt: response.data.createdAt,
                        lastActivityAt: response.data.createdAt
                    };
                    this.questionsSubject.next([questionListItem, ...currentQuestions]);
                    this.toastService.success('Question posted successfully');

                    return response;
                }
                throw new Error(response.message || 'Failed to create question');
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    answerQuestion(request: CreateAnswerRequest): Observable<AnswerResponse> {
        this.loadingService.show();
        this.clearError();

        return this.qaAnswerService.createAnswer(request).pipe(
            map(response => {
                if (response.succeeded && response.data) {
                    // Add to answers list
                    const currentAnswers = this.answersSubject.value;
                    this.answersSubject.next([...currentAnswers, response.data]);

                    // Update current question answer count
                    const currentQuestion = this.currentQuestionSubject.value;
                    if (currentQuestion && currentQuestion.id === request.questionId) {
                        this.currentQuestionSubject.next({
                            ...currentQuestion,
                            answerCount: currentQuestion.answerCount + 1,
                            answers: [...(currentQuestion.answers || []), response.data]
                        });
                    }

                    this.toastService.success('Answer posted successfully');
                    return response;
                }
                throw new Error(response.message || 'Failed to create answer');
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    voteQuestion(id: string, isUpvote: boolean): Observable<ApiResponse<any>> {
        this.loadingService.show();
        this.clearError();

        return this.qaVotingService.createVote({
            contentId: id,
            contentType: 'Question',
            voteType: isUpvote ? 'Up' : 'Down'
        }).pipe(
            map(response => {
                if (response.succeeded) {
                    // Update user votes
                    const currentVotes = this.userVotesSubject.value;
                    this.userVotesSubject.next({
                        ...currentVotes,
                        [id]: isUpvote ? 'Up' : 'Down'
                    });

                    // Update question vote score in state
                    this.updateQuestionVoteScore(id, isUpvote ? 1 : -1);

                    return response;
                }
                throw new Error(response.message || 'Failed to vote on question');
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    voteAnswer(id: string, isUpvote: boolean): Observable<ApiResponse<any>> {
        this.loadingService.show();
        this.clearError();

        return this.qaVotingService.createVote({
            contentId: id,
            contentType: 'Answer',
            voteType: isUpvote ? 'Up' : 'Down'
        }).pipe(
            map(response => {
                if (response.succeeded) {
                    // Update user votes
                    const currentVotes = this.userVotesSubject.value;
                    this.userVotesSubject.next({
                        ...currentVotes,
                        [id]: isUpvote ? 'Up' : 'Down'
                    });

                    // Update answer vote score in state
                    this.updateAnswerVoteScore(id, isUpvote ? 1 : -1);

                    return response;
                }
                throw new Error(response.message || 'Failed to vote on answer');
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    acceptAnswer(questionId: string, answerId: string): Observable<ApiResponse<any>> {
        this.loadingService.show();
        this.clearError();

        return this.qaAnswerService.acceptAnswer(answerId).pipe(
            map(response => {
                if (response.succeeded) {
                    // Update answer acceptance in state
                    const currentAnswers = this.answersSubject.value;
                    const updatedAnswers = currentAnswers.map(a => ({
                        ...a,
                        isAccepted: a.id === answerId ? true : false // Only one answer can be accepted
                    }));
                    this.answersSubject.next(updatedAnswers);

                    // Update current question
                    const currentQuestion = this.currentQuestionSubject.value;
                    if (currentQuestion) {
                        const updatedQuestionAnswers = currentQuestion.answers?.map(a => ({
                            ...a,
                            isAccepted: a.id === answerId ? true : false
                        })) || [];

                        this.currentQuestionSubject.next({
                            ...currentQuestion,
                            acceptedAnswerId: answerId,
                            answers: updatedQuestionAnswers
                        });
                    }

                    this.toastService.success('Answer accepted successfully');
                    return response;
                }
                throw new Error(response.message || 'Failed to accept answer');
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    // New enhanced methods following existing patterns
    searchQuestions(filter: SearchFilter): Observable<QuestionList[]> {
        this.loadingService.show();
        this.clearError();

        return this.qaSearchService.searchQuestions(filter).pipe(
            map(response => {
                if (response.succeeded && response.data) {
                    this.questionsSubject.next(response.data.items);
                    return response.data.items;
                }
                throw new Error(response.message || 'Search failed');
            }),
            tap(() => this.loadingService.hide()),
            catchError(error => {
                this.handleError(error);
                return throwError(() => error);
            })
        );
    }

    getUserReputation(): Observable<UserReputation | null> {
        return this.qaReputationService.getUserReputation().pipe(
            map(response => {
                if (response.succeeded && response.data) {
                    this.userReputationSubject.next(response.data);
                    return response.data;
                }
                return null;
            }),
            catchError(error => {
                console.warn('Failed to load user reputation:', error);
                return throwError(() => error);
            })
        );
    }

    // Real-time integration methods
    private initializeRealtimeUpdates(): void {
        // Subscribe to real-time events and update state accordingly
        this.qaSignalRService.questionCreated$.subscribe(event => {
            const currentQuestions = this.questionsSubject.value;
            // Add new question to the beginning of the list (if it matches current filters)
            // This is a simplified implementation - in reality, you'd check filters
            console.log('New question created:', event);
        });

        this.qaSignalRService.answerCreated$.subscribe(event => {
            const currentQuestion = this.currentQuestionSubject.value;
            if (currentQuestion && currentQuestion.id === event.questionId) {
                // Refresh the question to get the new answer
                this.qaQuestionService.getQuestionDetail(event.questionId).subscribe(response => {
                    if (response.succeeded && response.data) {
                        this.currentQuestionSubject.next(response.data);
                        this.answersSubject.next(response.data.answers || []);
                    }
                });
            }
        });

        this.qaSignalRService.voteCreated$.subscribe(event => {
            // Update vote scores in real-time
            if (event.contentType === 'Question') {
                this.updateQuestionVoteScoreRealtime(event.contentId, event.voteScore);
            } else {
                this.updateAnswerVoteScoreRealtime(event.contentId, event.voteScore);
            }
        });

        this.qaSignalRService.reputationUpdated$.subscribe(event => {
            // Update user reputation if it's the current user
            const currentUser = this.authService.currentUser();
            if (currentUser && currentUser.id === event.userId) {
                this.getUserReputation().subscribe();
            }
        });
    }

    private loadUserData(): void {
        // Load user-specific data when authenticated
        this.authService.currentUser$.subscribe(user => {
            if (user) {
                this.loadUserVotes();
                this.getUserReputation().subscribe();
            } else {
                this.userVotesSubject.next({});
                this.userReputationSubject.next(null);
            }
        });
    }

    private loadUserVotes(): void {
        this.qaVotingService.getUserVotes({ pageSize: 1000 }).subscribe({
            next: (response) => {
                if (response.succeeded && response.data) {
                    const votes: { [contentId: string]: 'Up' | 'Down' } = {};
                    response.data.items.forEach((vote: Vote) => {
                        votes[vote.contentId] = vote.voteType;
                    });
                    this.userVotesSubject.next(votes);
                }
            },
            error: (error) => {
                console.warn('Failed to load user votes:', error);
            }
        });
    }

    // Helper methods for state updates
    private updateQuestionVoteScore(questionId: string, scoreChange: number): void {
        const currentQuestions = this.questionsSubject.value;
        const updatedQuestions = currentQuestions.map(q => {
            if (q.id === questionId) {
                return { ...q, voteScore: q.voteScore + scoreChange };
            }
            return q;
        });
        this.questionsSubject.next(updatedQuestions);

        // Update current question if it matches
        const currentQuestion = this.currentQuestionSubject.value;
        if (currentQuestion && currentQuestion.id === questionId) {
            this.currentQuestionSubject.next({
                ...currentQuestion,
                voteScore: currentQuestion.voteScore + scoreChange
            });
        }
    }

    private updateQuestionVoteScoreRealtime(questionId: string, newScore: number): void {
        const currentQuestions = this.questionsSubject.value;
        const updatedQuestions = currentQuestions.map(q => {
            if (q.id === questionId) {
                return { ...q, voteScore: newScore };
            }
            return q;
        });
        this.questionsSubject.next(updatedQuestions);

        // Update current question if it matches
        const currentQuestion = this.currentQuestionSubject.value;
        if (currentQuestion && currentQuestion.id === questionId) {
            this.currentQuestionSubject.next({
                ...currentQuestion,
                voteScore: newScore
            });
        }
    }

    private updateAnswerVoteScore(answerId: string, scoreChange: number): void {
        const currentAnswers = this.answersSubject.value;
        const updatedAnswers = currentAnswers.map(a => {
            if (a.id === answerId) {
                return { ...a, voteScore: a.voteScore + scoreChange };
            }
            return a;
        });
        this.answersSubject.next(updatedAnswers);

        // Update answer in current question
        const currentQuestion = this.currentQuestionSubject.value;
        if (currentQuestion && currentQuestion.answers) {
            const updatedQuestionAnswers = currentQuestion.answers.map(a => {
                if (a.id === answerId) {
                    return { ...a, voteScore: a.voteScore + scoreChange };
                }
                return a;
            });
            this.currentQuestionSubject.next({
                ...currentQuestion,
                answers: updatedQuestionAnswers
            });
        }
    }

    private updateAnswerVoteScoreRealtime(answerId: string, newScore: number): void {
        const currentAnswers = this.answersSubject.value;
        const updatedAnswers = currentAnswers.map(a => {
            if (a.id === answerId) {
                return { ...a, voteScore: newScore };
            }
            return a;
        });
        this.answersSubject.next(updatedAnswers);

        // Update answer in current question
        const currentQuestion = this.currentQuestionSubject.value;
        if (currentQuestion && currentQuestion.answers) {
            const updatedQuestionAnswers = currentQuestion.answers.map(a => {
                if (a.id === answerId) {
                    return { ...a, voteScore: newScore };
                }
                return a;
            });
            this.currentQuestionSubject.next({
                ...currentQuestion,
                answers: updatedQuestionAnswers
            });
        }
    }

    // Conversion methods no longer needed as we use the new types directly.
    // QuestionStatus and QuestionPriority enums should be migrated to string literals if possible.

    // Utility methods following existing patterns
    private clearError(): void {
        this.errorSubject.next(null);
    }

    private handleError(error: any): void {
        console.error('QA Service Error:', error);
        let errorMessage = 'An error occurred';

        if (error?.message) {
            errorMessage = error.message;
        } else if (error?.errors?.length > 0) {
            errorMessage = error.errors[0];
        }

        this.errorSubject.next(errorMessage);
        this.toastService.error(errorMessage);
        this.loadingService.hide();
    }

    // Public getters for current state
    get currentQuestions(): QuestionList[] {
        return this.questionsSubject.value;
    }

    get currentQuestion(): QuestionDetail | null {
        return this.currentQuestionSubject.value;
    }

    get currentAnswers(): Answer[] {
        return this.answersSubject.value;
    }

    get currentUserReputation(): UserReputation | null {
        return this.userReputationSubject.value;
    }

    get isLoading(): boolean {
        return this.loadingSubject.value;
    }

    get currentError(): string | null {
        return this.errorSubject.value;
    }

    get userVotes(): { [contentId: string]: 'Up' | 'Down' } {
        return this.userVotesSubject.value;
    }

    // SignalR integration methods
    get qaSignalR(): QASignalRService {
        return this.qaSignalRService;
    }

    get isConnectedToRealtime(): boolean {
        return this.qaSignalRService.isConnected;
    }
}
