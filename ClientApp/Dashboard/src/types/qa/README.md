# QA API Types for React Dashboard Application

This directory contains TypeScript interfaces and types for the QA (Question & Answer) system specifically for the React Dashboard application.

## Overview

These types provide:
- **Type safety** for all QA-related API interactions
- **Consistent API contracts** with the backend
- **React-specific patterns** using Promises and hooks
- **Dashboard-specific features** for moderation and analytics
- **Comprehensive error handling** and validation

## Files

- `api-types.ts` - Core QA API types and interfaces
- `api.ts` - React-specific service interfaces and patterns

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

### Dashboard-Specific Analytics
Extended analytics for administrative oversight:

```typescript
interface QAAnalytics {
  totalQuestions: number;
  totalAnswers: number;
  totalVotes: number;
  totalUsers: number;
  averageResponseTime: number;
  topCategories: { name: string; count: number }[];
  topTags: { name: string; count: number }[];
  topExperts: Expert[];
  recentActivity: QAActivity[];
  trendingQuestions: QuestionList[];
  unansweredQuestions: QuestionList[];
  flaggedContent: FlaggedContent[];
}
```

### Moderation Features
Comprehensive moderation capabilities:

```typescript
interface BulkModerationRequest {
  action: 'delete' | 'close' | 'flag';
  contentIds: string[];
  reason: string;
  contentType: 'Question' | 'Answer';
}

interface UserModerationInfo {
  userId: string;
  userName: string;
  reputationScore: number;
  flaggedContentCount: number;
  moderationActions: ModerationAction[];
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: string;
}
```

## Usage in React Services

```typescript
import { ApiService } from '../api/ApiService';
import { 
  ApiResponse, 
  PaginatedApiResponse, 
  QuestionList, 
  QuestionFilter 
} from './api-types';

export class QAService extends ApiService {
  async getQuestions(filter?: QuestionFilter): Promise<PaginatedApiResponse<QuestionList>> {
    return this.get<PaginatedApiResponse<QuestionList>>('/api/v7/qa/questions');
  }
}
```

## Usage in React Hooks

```typescript
import { useState, useEffect } from 'react';
import { QuestionList, QuestionFilter } from '../types/qa/api-types';
import { qaService } from '../services/qa/QAQuestionService';

export function useQuestions(filter?: QuestionFilter) {
  const [questions, setQuestions] = useState<QuestionList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      setLoading(true);
      try {
        const response = await qaService.getQuestions(filter);
        if (response.succeeded && response.data) {
          setQuestions(response.data.items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [filter]);

  return { questions, loading, error };
}
```

## Dashboard-Specific Features

### Analytics Dashboard
```typescript
interface QAAnalyticsDashboard {
  analytics: QAAnalytics;
  loading: boolean;
  error: string | null;
  refreshAnalytics: () => Promise<void>;
}
```

### Moderation Tools
```typescript
interface QAModerationTools {
  flaggedContent: FlaggedContent[];
  moderationActions: ModerationAction[];
  bulkModerate: (request: BulkModerationRequest) => Promise<void>;
  reviewFlag: (flagId: string, action: 'approve' | 'reject', notes?: string) => Promise<void>;
}
```

### User Management
```typescript
interface QAUserManagement {
  users: UserModerationInfo[];
  banUser: (userId: string, duration: number, reason: string) => Promise<void>;
  adjustReputation: (userId: string, adjustment: number, reason: string) => Promise<void>;
  awardBadge: (userId: string, badgeType: string) => Promise<void>;
}
```

## Component Props

### Question Management
```typescript
interface QuestionManagementProps {
  questions: QuestionList[];
  onEdit: (question: QuestionList) => void;
  onDelete: (questionId: string) => void;
  onClose: (questionId: string, reason: string) => void;
  onFlag: (questionId: string, reason: string) => void;
}
```

### Analytics Display
```typescript
interface AnalyticsDisplayProps {
  analytics: QAAnalytics;
  timeRange: 'day' | 'week' | 'month' | 'year';
  onTimeRangeChange: (range: string) => void;
}
```

## Error Handling

Dashboard-specific error handling:

```typescript
interface DashboardErrorHandler {
  handleApiError: (error: any) => void;
  showNotification: (message: string, type: 'success' | 'error' | 'warning') => void;
  logModerationAction: (action: ModerationAction) => void;
}
```

## Best Practices

1. **Use async/await with proper error handling**:
```typescript
try {
  const response = await qaService.getQuestions(filter);
  if (response.succeeded && response.data) {
    return response.data.items;
  }
  throw new Error(response.message || 'Failed to load questions');
} catch (error) {
  console.error('QA Service Error:', error);
  throw error;
}
```

2. **Implement proper loading states**:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleOperation = async () => {
  setLoading(true);
  setError(null);
  try {
    await performOperation();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Operation failed');
  } finally {
    setLoading(false);
  }
};
```

3. **Use type guards for runtime safety**:
```typescript
if (isApiResponse<QAAnalytics>(response) && response.succeeded) {
  // Handle analytics data
}
```

4. **Validate moderation actions**:
```typescript
const validateModerationRequest = (request: BulkModerationRequest): string[] => {
  const errors: string[] = [];
  if (!request.contentIds.length) errors.push('No content selected');
  if (!request.reason.trim()) errors.push('Reason is required');
  return errors;
};
```

This type system ensures consistency, type safety, and comprehensive functionality for the React Dashboard application's QA management features.