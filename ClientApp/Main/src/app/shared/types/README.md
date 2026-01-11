# QA API Types for Angular Main Application

This directory contains TypeScript interfaces and types for the QA (Question & Answer) system specifically for the Angular Main application.

## Overview

These types provide:
- **Type safety** for all QA-related API interactions
- **Consistent API contracts** with the backend
- **Angular-specific patterns** using RxJS Observables
- **Comprehensive error handling** and validation

## Files

- `qa-api.types.ts` - Core QA API types and interfaces

## Key Features

### API Response Format
All API responses follow a consistent structure:

```typescript
interface ApiResponse<T = unknown> {
  succeeded: boolean;
  data?: T;
  message?: string;
  errors: string[];
  statusCode?: number;
  timestamp: string;
}
```

### Pagination Support
Standardized pagination for all list endpoints:

```typescript
interface PaginatedResponse<T = unknown> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;
}
```

### Advanced Filtering
Type-safe filtering for questions, answers, and search:

```typescript
interface QuestionFilter extends BaseFilter {
  category?: string;
  tags?: string[];
  status?: 'open' | 'closed' | 'answered' | 'unanswered';
  userId?: string;
  hasAcceptedAnswer?: boolean;
  minVoteScore?: number;
  maxVoteScore?: number;
  dateFrom?: string;
  dateTo?: string;
  includeScheduled?: boolean;
}
```

## Usage in Angular Services

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  ApiResponse, 
  PaginatedApiResponse, 
  QuestionList, 
  QuestionFilter 
} from '../shared/types/qa-api.types';

@Injectable()
export class QAService {
  constructor(private http: HttpClient) {}

  getQuestions(filter?: QuestionFilter): Observable<PaginatedApiResponse<QuestionList>> {
    return this.http.get<PaginatedApiResponse<QuestionList>>('/api/v7/qa/questions');
  }
}
```

## Entity Types

### Core Entities
- `Question` - Complete question data
- `QuestionList` - Optimized for list views
- `QuestionDetail` - Extended with answers and similar questions
- `Answer` - Answer data with voting information
- `Vote` - Voting information and metadata
- `UserReputation` - User reputation and badges
- `Expert` - Expert user information

### Supporting Types
- `Category` - Question categorization
- `Tag` - Question tagging
- `ReputationHistory` - Reputation tracking
- `QuestionSimilarity` - Similar question detection

## Request Types

- `CreateQuestionRequest` - New question creation
- `UpdateQuestionRequest` - Question modification
- `CreateAnswerRequest` - New answer creation
- `UpdateAnswerRequest` - Answer modification
- `CreateVoteRequest` - Vote casting
- `CloseQuestionRequest` - Question closure

## API Endpoints

Predefined endpoint constants:

```typescript
export const QA_API_ENDPOINTS = {
  QUESTIONS: {
    BASE: '/api/v7/qa/questions',
    SEARCH: '/api/v7/qa/questions/search',
    SIMILAR: (id: string) => `/api/v7/qa/questions/similar/${id}`,
    // ... more endpoints
  }
} as const;
```

## Type Guards

Utility functions for runtime type checking:

```typescript
if (isApiResponse(response) && response.succeeded) {
  // Handle success
}

if (isErrorResponse(response)) {
  // Handle error
}
```

## Best Practices

1. **Always check response success**:
```typescript
if (response.succeeded && response.data) {
  return response.data;
} else {
  throw new Error(response.message || 'Operation failed');
}
```

2. **Use type guards**:
```typescript
if (isApiResponse<Question>(response)) {
  // TypeScript knows response is ApiResponse<Question>
}
```

3. **Build filters incrementally**:
```typescript
const filter: QuestionFilter = {
  pageNumber: 1,
  pageSize: 10
};

if (searchTerm) filter.searchTerm = searchTerm;
if (category) filter.category = category;
```

This type system ensures consistency and type safety for the Angular Main application's QA functionality.