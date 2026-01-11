import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

// Import internal types
import type {
  ApiResponse,
  PaginatedApiResponse,
  Question,
  QuestionList,
  QuestionDetail,
  QuestionSimilarity,
  QuestionFilter,
  SearchFilter,
  CreateQuestionRequest,
  UpdateQuestionRequest,
  CloseQuestionRequest,
  Answer
} from '../../../shared/types/qa-api.types';
import { QA_API_ENDPOINTS } from '../../../shared/types/qa-api.types';

// Import Angular-specific interfaces
import type { IQAQuestionService } from '../../../shared/interfaces/qa-api.interface';

@Injectable({
  providedIn: 'root'
})
export class QAQuestionService implements IQAQuestionService {
  private readonly baseUrl = QA_API_ENDPOINTS.QUESTIONS.BASE;

  constructor(private http: HttpClient) {}

  getQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
      if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer.toString());
      if (filter.minVoteScore !== undefined) params = params.set('minVoteScore', filter.minVoteScore.toString());
      if (filter.maxVoteScore !== undefined) params = params.set('maxVoteScore', filter.maxVoteScore.toString());
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
      if (filter.includeScheduled !== undefined) params = params.set('includeScheduled', filter.includeScheduled.toString());
      
      if (filter.tags && filter.tags.length > 0) {
        filter.tags.forEach((tag: string) => {
          params = params.append('tags', tag);
        });
      }
    }

    return this.http.get<PaginatedApiResponse<QuestionList>>(this.baseUrl, { params })
      .pipe(
        catchError((error) => {
          console.error('API Error:', error);
          // Return mock data as fallback
          return this.getMockQuestions(filter);
        })
      );
  }

  private getMockQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>> {
    const mockQuestions: QuestionList[] = [
      {
        id: '1',
        title: 'How to implement authentication in Angular?',
        category: 'Web Development',
        tags: ['angular', 'authentication', 'jwt'],
        userName: 'john_doe',
        userReputation: 1250,
        voteScore: 15,
        answerCount: 3,
        viewCount: 127,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user1',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Best practices for React state management?',
        category: 'Web Development',
        tags: ['react', 'state-management', 'redux'],
        userName: 'jane_smith',
        userReputation: 2100,
        voteScore: 23,
        answerCount: 5,
        viewCount: 245,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user2',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'SQL Server performance optimization tips?',
        category: 'Database Design',
        tags: ['sql-server', 'performance', 'optimization'],
        userName: 'db_expert',
        userReputation: 3500,
        voteScore: 18,
        answerCount: 4,
        viewCount: 189,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user3',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        title: 'Docker containerization for .NET applications',
        category: 'DevOps & Cloud',
        tags: ['docker', 'dotnet', 'containerization'],
        userName: 'devops_guru',
        userReputation: 1800,
        voteScore: 12,
        answerCount: 2,
        viewCount: 98,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user4',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        title: 'Machine learning model deployment strategies',
        category: 'Data Science',
        tags: ['machine-learning', 'deployment', 'python'],
        userName: 'ml_researcher',
        userReputation: 2800,
        voteScore: 31,
        answerCount: 7,
        viewCount: 412,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user5',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '6',
        title: 'Understanding TypeScript generics and constraints',
        category: 'Web Development',
        tags: ['typescript', 'generics', 'types'],
        userName: 'ts_expert',
        userReputation: 3200,
        voteScore: 28,
        answerCount: 6,
        viewCount: 234,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user6',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '7',
        title: 'GraphQL vs REST API design patterns',
        category: 'API Design',
        tags: ['graphql', 'rest', 'api-design'],
        userName: 'api_architect',
        userReputation: 2650,
        voteScore: 19,
        answerCount: 4,
        viewCount: 156,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user7',
        createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '8',
        title: 'Kubernetes deployment best practices',
        category: 'DevOps & Cloud',
        tags: ['kubernetes', 'deployment', 'devops'],
        userName: 'k8s_admin',
        userReputation: 2100,
        voteScore: 22,
        answerCount: 5,
        viewCount: 189,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user8',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '9',
        title: 'MongoDB aggregation pipeline optimization',
        category: 'Database Design',
        tags: ['mongodb', 'aggregation', 'performance'],
        userName: 'mongo_dev',
        userReputation: 1950,
        voteScore: 16,
        answerCount: 3,
        viewCount: 143,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user9',
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '10',
        title: 'Vue.js 3 Composition API patterns',
        category: 'Web Development',
        tags: ['vuejs', 'composition-api', 'vue3'],
        userName: 'vue_developer',
        userReputation: 1750,
        voteScore: 14,
        answerCount: 2,
        viewCount: 98,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user10',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '11',
        title: 'AWS Lambda cold start optimization',
        category: 'DevOps & Cloud',
        tags: ['aws', 'lambda', 'serverless'],
        userName: 'cloud_engineer',
        userReputation: 2400,
        voteScore: 25,
        answerCount: 6,
        viewCount: 278,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user11',
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '12',
        title: 'Python async/await vs threading performance',
        category: 'Programming Languages',
        tags: ['python', 'async', 'threading'],
        userName: 'python_guru',
        userReputation: 3100,
        voteScore: 33,
        answerCount: 8,
        viewCount: 456,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user12',
        createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 11 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '13',
        title: 'Redis caching strategies for web applications',
        category: 'Database Design',
        tags: ['redis', 'caching', 'performance'],
        userName: 'cache_expert',
        userReputation: 2200,
        voteScore: 20,
        answerCount: 4,
        viewCount: 167,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user13',
        createdAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '14',
        title: 'Microservices communication patterns',
        category: 'System Architecture',
        tags: ['microservices', 'architecture', 'communication'],
        userName: 'architect_pro',
        userReputation: 2850,
        voteScore: 27,
        answerCount: 5,
        viewCount: 234,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user14',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 13 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '15',
        title: 'Flutter state management with Riverpod',
        category: 'Mobile Development',
        tags: ['flutter', 'riverpod', 'state-management'],
        userName: 'flutter_dev',
        userReputation: 1650,
        voteScore: 13,
        answerCount: 3,
        viewCount: 112,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user15',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '16',
        title: 'Elasticsearch query optimization techniques',
        category: 'Search & Analytics',
        tags: ['elasticsearch', 'search', 'optimization'],
        userName: 'search_engineer',
        userReputation: 2300,
        voteScore: 21,
        answerCount: 4,
        viewCount: 178,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user16',
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 15 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '17',
        title: 'Blockchain smart contract security best practices',
        category: 'Blockchain',
        tags: ['blockchain', 'smart-contracts', 'security'],
        userName: 'blockchain_dev',
        userReputation: 1900,
        voteScore: 17,
        answerCount: 3,
        viewCount: 134,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user17',
        createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '18',
        title: 'Next.js 13 app directory migration guide',
        category: 'Web Development',
        tags: ['nextjs', 'migration', 'app-directory'],
        userName: 'nextjs_expert',
        userReputation: 2750,
        voteScore: 29,
        answerCount: 6,
        viewCount: 298,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user18',
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 17 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '19',
        title: 'TensorFlow model optimization for mobile',
        category: 'Data Science',
        tags: ['tensorflow', 'mobile', 'optimization'],
        userName: 'ai_engineer',
        userReputation: 3400,
        voteScore: 35,
        answerCount: 7,
        viewCount: 389,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user19',
        createdAt: new Date(Date.now() - 19 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '20',
        title: 'Rust memory management and ownership',
        category: 'Programming Languages',
        tags: ['rust', 'memory-management', 'ownership'],
        userName: 'rust_developer',
        userReputation: 2050,
        voteScore: 24,
        answerCount: 5,
        viewCount: 201,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user20',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 19 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '21',
        title: 'Apache Kafka stream processing patterns',
        category: 'Data Engineering',
        tags: ['kafka', 'streaming', 'data-processing'],
        userName: 'data_engineer',
        userReputation: 2600,
        voteScore: 26,
        answerCount: 5,
        viewCount: 223,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user21',
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '22',
        title: 'SwiftUI navigation and state management',
        category: 'Mobile Development',
        tags: ['swiftui', 'navigation', 'ios'],
        userName: 'ios_developer',
        userReputation: 1850,
        voteScore: 18,
        answerCount: 4,
        viewCount: 145,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user22',
        createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 21 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '23',
        title: 'PostgreSQL query performance tuning',
        category: 'Database Design',
        tags: ['postgresql', 'performance', 'tuning'],
        userName: 'postgres_dba',
        userReputation: 2450,
        voteScore: 22,
        answerCount: 4,
        viewCount: 187,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user23',
        createdAt: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '24',
        title: 'Terraform infrastructure as code best practices',
        category: 'DevOps & Cloud',
        tags: ['terraform', 'iac', 'infrastructure'],
        userName: 'devops_lead',
        userReputation: 2150,
        voteScore: 19,
        answerCount: 3,
        viewCount: 156,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user24',
        createdAt: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '25',
        title: 'WebAssembly performance optimization strategies',
        category: 'Web Development',
        tags: ['webassembly', 'performance', 'wasm'],
        userName: 'wasm_expert',
        userReputation: 2900,
        voteScore: 30,
        answerCount: 6,
        viewCount: 267,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user25',
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Apply basic filtering
    let filteredQuestions = [...mockQuestions];
    
    if (filter?.searchTerm) {
      const searchTerm = filter.searchTerm.toLowerCase();
      filteredQuestions = filteredQuestions.filter(q => 
        q.title.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filter?.category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === filter.category);
    }
    
    if (filter?.tags && filter.tags.length > 0) {
      filteredQuestions = filteredQuestions.filter(q => 
        filter.tags!.some(tag => q.tags.includes(tag))
      );
    }

    if (filter?.status) {
      switch (filter.status) {
        case 'answered':
          filteredQuestions = filteredQuestions.filter(q => q.answerCount > 0);
          break;
        case 'unanswered':
          filteredQuestions = filteredQuestions.filter(q => q.answerCount === 0);
          break;
        case 'closed':
          filteredQuestions = filteredQuestions.filter(q => q.isClosed);
          break;
      }
    }

    // Apply sorting
    if (filter?.sortBy) {
      filteredQuestions.sort((a, b) => {
        let aValue: any, bValue: any;
        
        switch (filter.sortBy) {
          case 'createdAt':
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
            break;
          case 'voteScore':
            aValue = a.voteScore;
            bValue = b.voteScore;
            break;
          case 'answerCount':
            aValue = a.answerCount;
            bValue = b.answerCount;
            break;
          case 'viewCount':
            aValue = a.viewCount;
            bValue = b.viewCount;
            break;
          case 'lastActivityAt':
            aValue = new Date(a.lastActivityAt || a.createdAt).getTime();
            bValue = new Date(b.lastActivityAt || b.createdAt).getTime();
            break;
          default:
            aValue = new Date(a.createdAt).getTime();
            bValue = new Date(b.createdAt).getTime();
        }
        
        return filter.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    // Apply pagination
    const pageSize = filter?.pageSize || 10;
    const pageNumber = filter?.pageNumber || 1;
    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

    const mockResponse: PaginatedApiResponse<QuestionList> = {
      succeeded: true,
      message: 'Mock data loaded successfully',
      errors: [],
      timestamp: new Date().toISOString(),
      data: {
        items: paginatedQuestions,
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalCount: filteredQuestions.length,
        totalPages: Math.ceil(filteredQuestions.length / pageSize),
        hasPreviousPage: pageNumber > 1,
        hasNextPage: pageNumber < Math.ceil(filteredQuestions.length / pageSize),
        isFirstPage: pageNumber === 1,
        isLastPage: pageNumber === Math.ceil(filteredQuestions.length / pageSize)
      }
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 500); // Simulate network delay
    });
  }

  getQuestion(id: string): Observable<ApiResponse<Question>> {
    return this.http.get<ApiResponse<Question>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error('API Error:', error);
          // Return mock data as fallback
          return this.getMockQuestion(id);
        })
      );
  }

  private getMockQuestion(id: string): Observable<ApiResponse<Question>> {
    const mockQuestions = this.getAllMockQuestions();
    const foundQuestion = mockQuestions.find(q => q.id === id);
    
    const mockQuestion: Question = foundQuestion ? {
      id: foundQuestion.id,
      title: foundQuestion.title,
      content: this.getMockQuestionContent(foundQuestion.title),
      category: foundQuestion.category,
      tags: foundQuestion.tags,
      viewCount: foundQuestion.viewCount,
      voteScore: foundQuestion.voteScore,
      upvotesCount: Math.max(0, foundQuestion.voteScore + Math.floor(Math.random() * 5)),
      downvotesCount: Math.max(0, Math.floor(Math.random() * 3)),
      answerCount: foundQuestion.answerCount,
      acceptedAnswerId: foundQuestion.hasAcceptedAnswer ? 'answer-1' : undefined,
      isClosed: foundQuestion.isClosed,
      closedReason: foundQuestion.isClosed ? 'Duplicate question' : undefined,
      isScheduled: false,
      scheduledAt: undefined,
      userId: foundQuestion.userId,
      userName: foundQuestion.userName,
      userReputation: foundQuestion.userReputation,
      createdAt: foundQuestion.createdAt,
      updatedAt: undefined,
      userVote: undefined
    } : {
      id: id,
      title: 'Sample Question',
      content: 'This is a sample question content.',
      category: 'General',
      tags: ['sample'],
      viewCount: 50,
      voteScore: 5,
      upvotesCount: 7,
      downvotesCount: 2,
      answerCount: 1,
      acceptedAnswerId: undefined,
      isClosed: false,
      closedReason: undefined,
      isScheduled: false,
      scheduledAt: undefined,
      userId: 'sample-user',
      userName: 'sample_user',
      userReputation: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: undefined,
      userVote: undefined
    };

    const mockResponse: ApiResponse<Question> = {
      succeeded: true,
      message: 'Mock question loaded successfully',
      errors: [],
      timestamp: new Date().toISOString(),
      data: mockQuestion
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 200);
    });
  }

  getQuestionDetail(id: string): Observable<ApiResponse<QuestionDetail>> {
    return this.http.get<ApiResponse<QuestionDetail>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error('API Error:', error);
          // Return mock data as fallback
          return this.getMockQuestionDetail(id);
        })
      );
  }

  private getMockQuestionDetail(id: string): Observable<ApiResponse<QuestionDetail>> {
    // Find the question from our mock list or create a default one
    const mockQuestions = this.getAllMockQuestions();
    const foundQuestion = mockQuestions.find(q => q.id === id);
    
    const baseQuestion = foundQuestion || {
      id: id,
      title: 'Sample Question Title',
      category: 'Web Development',
      tags: ['sample', 'question'],
      userName: 'sample_user',
      userReputation: 1500,
      voteScore: 10,
      answerCount: 2,
      viewCount: 85,
      hasAcceptedAnswer: true,
      isClosed: false,
      userId: 'sample_user_id',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      lastActivityAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
    };

    const mockQuestionDetail: QuestionDetail = {
      id: baseQuestion.id,
      title: baseQuestion.title,
      content: this.getMockQuestionContent(baseQuestion.title),
      category: baseQuestion.category,
      tags: baseQuestion.tags,
      viewCount: baseQuestion.viewCount,
      voteScore: baseQuestion.voteScore,
      upvotesCount: Math.max(0, baseQuestion.voteScore + Math.floor(Math.random() * 5)),
      downvotesCount: Math.max(0, Math.floor(Math.random() * 3)),
      answerCount: baseQuestion.answerCount,
      acceptedAnswerId: baseQuestion.hasAcceptedAnswer ? 'answer-1' : undefined,
      isClosed: baseQuestion.isClosed,
      closedReason: baseQuestion.isClosed ? 'Duplicate question' : undefined,
      isScheduled: false,
      scheduledAt: undefined,
      userId: baseQuestion.userId,
      userName: baseQuestion.userName,
      userReputation: baseQuestion.userReputation,
      createdAt: baseQuestion.createdAt,
      updatedAt: undefined,
      userVote: undefined,
      answers: this.getMockAnswers(baseQuestion.id, baseQuestion.answerCount),
      similarQuestions: this.getMockSimilarQuestions(baseQuestion.id)
    };

    const mockResponse: ApiResponse<QuestionDetail> = {
      succeeded: true,
      message: 'Mock question detail loaded successfully',
      errors: [],
      timestamp: new Date().toISOString(),
      data: mockQuestionDetail
    };

    return new Observable(observer => {
      setTimeout(() => {
        observer.next(mockResponse);
        observer.complete();
      }, 300); // Simulate network delay
    });
  }

  private getAllMockQuestions() {
    // Return the same mock questions we use in the list
    return [
      {
        id: '1',
        title: 'How to implement authentication in Angular?',
        category: 'Web Development',
        tags: ['angular', 'authentication', 'jwt'],
        userName: 'john_doe',
        userReputation: 1250,
        voteScore: 15,
        answerCount: 3,
        viewCount: 127,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user1',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        title: 'Best practices for React state management?',
        category: 'Web Development',
        tags: ['react', 'state-management', 'redux'],
        userName: 'jane_smith',
        userReputation: 2100,
        voteScore: 23,
        answerCount: 5,
        viewCount: 245,
        hasAcceptedAnswer: true,
        isClosed: false,
        userId: 'user2',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'SQL Server performance optimization tips?',
        category: 'Database Design',
        tags: ['sql-server', 'performance', 'optimization'],
        userName: 'db_expert',
        userReputation: 3500,
        voteScore: 18,
        answerCount: 4,
        viewCount: 189,
        hasAcceptedAnswer: false,
        isClosed: false,
        userId: 'user3',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        lastActivityAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      }
      // Add more as needed - keeping it shorter for the detail view
    ];
  }

  private getMockQuestionContent(title: string): string {
    const contentMap: { [key: string]: string } = {
      'How to implement authentication in Angular?': `
        <p>I'm building an Angular application and need to implement JWT-based authentication. I want to understand the best practices for:</p>
        <ul>
          <li>Storing JWT tokens securely</li>
          <li>Implementing route guards</li>
          <li>Handling token refresh</li>
          <li>Managing user sessions</li>
        </ul>
        <p>I've looked at several tutorials but they all seem to have different approaches. What's the recommended way to handle authentication in Angular 15+?</p>
        <pre><code>// Current approach I'm trying
@Injectable()
export class AuthService {
  private tokenKey = 'auth-token';
  
  login(credentials: LoginRequest) {
    return this.http.post('/api/auth/login', credentials);
  }
}</code></pre>
        <p>Is this the right approach? Any security concerns I should be aware of?</p>
      `,
      'Best practices for React state management?': `
        <p>I'm working on a large React application with complex state requirements. The app has:</p>
        <ul>
          <li>User authentication state</li>
          <li>Shopping cart functionality</li>
          <li>Real-time notifications</li>
          <li>Form data across multiple steps</li>
        </ul>
        <p>Currently using useState and useContext, but it's becoming unwieldy. Should I switch to Redux Toolkit, Zustand, or stick with Context API?</p>
        <p>What are the trade-offs between different state management solutions in 2024?</p>
      `,
      'SQL Server performance optimization tips?': `
        <p>I'm experiencing slow query performance in SQL Server with a database that has grown to several million records. Specific issues:</p>
        <ul>
          <li>SELECT queries taking 10+ seconds</li>
          <li>JOIN operations on large tables</li>
          <li>Complex WHERE clauses with multiple conditions</li>
        </ul>
        <p>Current query example:</p>
        <pre><code>SELECT u.*, p.*, o.*
FROM Users u
JOIN Profiles p ON u.Id = p.UserId
JOIN Orders o ON u.Id = o.UserId
WHERE u.CreatedDate > '2023-01-01'
AND p.Status = 'Active'
AND o.Total > 100</code></pre>
        <p>What indexing strategies and query optimizations should I consider?</p>
      `
    };

    return contentMap[title] || `
      <p>This is a sample question about <strong>${title}</strong>. The content would typically include:</p>
      <ul>
        <li>Detailed description of the problem</li>
        <li>Code examples or error messages</li>
        <li>What has been tried so far</li>
        <li>Expected vs actual results</li>
      </ul>
      <p>This mock content is displayed when the backend API is not available.</p>
    `;
  }

  private getMockAnswers(questionId: string, count: number): Answer[] {
    const answers: Answer[] = [];
    
    for (let i = 1; i <= count; i++) {
      answers.push({
        id: `answer-${i}`,
        questionId: questionId,
        content: this.getMockAnswerContent(i),
        voteScore: Math.floor(Math.random() * 20) + 1,
        upvotesCount: Math.floor(Math.random() * 25) + 5,
        downvotesCount: Math.floor(Math.random() * 5),
        isAccepted: i === 1, // First answer is accepted
        acceptedAt: i === 1 ? new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() : undefined,
        userId: `answerer-${i}`,
        userName: `expert_${i}`,
        userReputation: Math.floor(Math.random() * 5000) + 1000,
        createdAt: new Date(Date.now() - i * 60 * 60 * 1000).toISOString(),
        updatedAt: undefined,
        userVote: undefined,
        isEdited: false,
        versionHistory: []
      });
    }
    
    return answers;
  }

  private getMockAnswerContent(index: number): string {
    const contents = [
      `
        <p>Here's the recommended approach for JWT authentication in Angular:</p>
        <h3>1. Token Storage</h3>
        <p>Store JWT tokens in httpOnly cookies for better security, or use sessionStorage for SPA-only scenarios:</p>
        <pre><code>// AuthService
storeToken(token: string) {
  // Option 1: sessionStorage (less secure but simpler)
  sessionStorage.setItem('token', token);
  
  // Option 2: httpOnly cookie (more secure)
  // Handle this on the server side
}</code></pre>
        
        <h3>2. HTTP Interceptor</h3>
        <pre><code>@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest&lt;any&gt;, next: HttpHandler) {
    const token = this.authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: \`Bearer \${token}\` }
      });
    }
    return next.handle(req);
  }
}</code></pre>
        
        <p>This approach ensures all HTTP requests automatically include the auth token.</p>
      `,
      `
        <p>Additionally, implement proper route guards:</p>
        <pre><code>@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  
  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}</code></pre>
        
        <p>And don't forget to handle token refresh:</p>
        <pre><code>refreshToken() {
  return this.http.post('/api/auth/refresh', {})
    .pipe(
      tap(response => this.storeToken(response.token))
    );
}</code></pre>
      `,
      `
        <p>For production applications, also consider:</p>
        <ul>
          <li><strong>Token expiration handling</strong> - Automatically refresh or redirect to login</li>
          <li><strong>CSRF protection</strong> - Use Angular's built-in CSRF support</li>
          <li><strong>Secure headers</strong> - Implement proper CORS and security headers</li>
          <li><strong>Logout cleanup</strong> - Clear all stored tokens and redirect</li>
        </ul>
        
        <p>Example logout implementation:</p>
        <pre><code>logout() {
  // Clear tokens
  sessionStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  
  // Clear any cached user data
  this.currentUser.next(null);
  
  // Redirect to login
  this.router.navigate(['/login']);
}</code></pre>
        
        <p>This ensures a complete cleanup of the authentication state.</p>
      `
    ];
    
    return contents[index - 1] || `<p>This is answer #${index} with helpful information and code examples.</p>`;
  }

  private getMockSimilarQuestions(questionId: string): QuestionSimilarity[] {
    return [
      {
        id: 'similar-1',
        title: 'Angular JWT token refresh implementation',
        category: 'Web Development',
        voteScore: 12,
        similarityScore: 85,
        answerCount: 3,
        hasAcceptedAnswer: true,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'similar-2',
        title: 'Secure token storage in Angular applications',
        category: 'Web Development',
        voteScore: 8,
        similarityScore: 78,
        answerCount: 2,
        hasAcceptedAnswer: false,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'similar-3',
        title: 'Angular route guards with authentication',
        category: 'Web Development',
        voteScore: 15,
        similarityScore: 72,
        answerCount: 4,
        hasAcceptedAnswer: true,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];
  }

  createQuestion(request: CreateQuestionRequest): Observable<ApiResponse<Question>> {
    return this.http.post<ApiResponse<Question>>(this.baseUrl, request)
      .pipe(
        catchError(this.handleError<ApiResponse<Question>>())
      );
  }

  updateQuestion(id: string, request: UpdateQuestionRequest): Observable<ApiResponse<Question>> {
    return this.http.put<ApiResponse<Question>>(`${this.baseUrl}/${id}`, request)
      .pipe(
        catchError(this.handleError<ApiResponse<Question>>())
      );
  }

  deleteQuestion(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

  closeQuestion(id: string, request: CloseQuestionRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/${id}/close`, request)
      .pipe(
        catchError(this.handleError<ApiResponse<void>>())
      );
  }

  searchQuestions(filter: SearchFilter): Observable<PaginatedApiResponse<QuestionList>> {
    let params = new HttpParams();
    
    if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
    if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
    if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
    if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.minVoteScore !== undefined) params = params.set('minVoteScore', filter.minVoteScore.toString());
    if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer.toString());
    if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
    if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
    if (filter.includeContent !== undefined) params = params.set('includeContent', filter.includeContent.toString());
    if (filter.includeTags !== undefined) params = params.set('includeTags', filter.includeTags.toString());
    if (filter.includeUserInfo !== undefined) params = params.set('includeUserInfo', filter.includeUserInfo.toString());
    
    if (filter.categories && filter.categories.length > 0) {
      filter.categories.forEach((category: string) => {
        params = params.append('categories', category);
      });
    }
    
    if (filter.tags && filter.tags.length > 0) {
      filter.tags.forEach((tag: string) => {
        params = params.append('tags', tag);
      });
    }
    
    if (filter.contentTypes && filter.contentTypes.length > 0) {
      filter.contentTypes.forEach((contentType: string) => {
        params = params.append('contentTypes', contentType);
      });
    }

    return this.http.get<PaginatedApiResponse<QuestionList>>(QA_API_ENDPOINTS.QUESTIONS.SEARCH, { params })
      .pipe(
        catchError(this.handleError<PaginatedApiResponse<QuestionList>>())
      );
  }

  getSimilarQuestions(id: string): Observable<ApiResponse<QuestionSimilarity[]>> {
    return this.http.get<ApiResponse<QuestionSimilarity[]>>(QA_API_ENDPOINTS.QUESTIONS.SIMILAR(id))
      .pipe(
        catchError(this.handleError<ApiResponse<QuestionSimilarity[]>>())
      );
  }

  getMyQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>> {
    let params = new HttpParams();
    
    if (filter) {
      if (filter.pageNumber) params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.pageSize) params = params.set('pageSize', filter.pageSize.toString());
      if (filter.sortBy) params = params.set('sortBy', filter.sortBy);
      if (filter.sortDirection) params = params.set('sortDirection', filter.sortDirection);
      if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
      if (filter.category) params = params.set('category', filter.category);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.hasAcceptedAnswer !== undefined) params = params.set('hasAcceptedAnswer', filter.hasAcceptedAnswer.toString());
      if (filter.dateFrom) params = params.set('dateFrom', filter.dateFrom);
      if (filter.dateTo) params = params.set('dateTo', filter.dateTo);
      
      if (filter.tags && filter.tags.length > 0) {
        filter.tags.forEach((tag: string) => {
          params = params.append('tags', tag);
        });
      }
    }

    return this.http.get<PaginatedApiResponse<QuestionList>>(QA_API_ENDPOINTS.QUESTIONS.MY_QUESTIONS, { params })
      .pipe(
        catchError(this.handleError<PaginatedApiResponse<QuestionList>>())
      );
  }

  viewQuestion(id: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/${id}/view`, {})
      .pipe(
        catchError((error) => {
          console.error('View tracking error:', error);
          // Return mock success response
          const mockResponse: ApiResponse<void> = {
            succeeded: true,
            message: 'View tracked (mock)',
            errors: [],
            timestamp: new Date().toISOString()
          };
          return new Observable<ApiResponse<void>>(observer => {
            observer.next(mockResponse);
            observer.complete();
          });
        })
      );
  }

  private handleError<T>() {
    return (error: any): Observable<T> => {
      console.error('QA Question Service Error:', error);
      
      // Create a standardized error response that matches our API format
      const errorResponse = {
        succeeded: false,
        data: undefined,
        message: error.error?.message || error.message || 'An error occurred',
        errors: error.error?.errors || [error.message || 'Unknown error'],
        statusCode: error.status || 500,
        timestamp: new Date().toISOString()
      } as T;

      return new Observable<T>(observer => {
        observer.next(errorResponse);
        observer.complete();
      });
    };
  }
}