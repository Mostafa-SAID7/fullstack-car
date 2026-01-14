import { ApiService } from '../api/ApiService';
import type { ApiResult } from '../../types/api';
import type {
  ApiResponse,
  PaginatedApiResponse,
  BulkModerationRequest
} from '../../types/qa/api-types';

/**
 * Bulk Operations Service extending existing ApiService patterns
 * Provides bulk moderation and management functionality for React Dashboard
 * Follows existing service architecture and error handling patterns
 */
export class BulkOperationsService extends ApiService {

  // Convert ApiResult to ApiResponse by adding timestamp
  private convertToApiResponse<T>(result: ApiResult<T>): ApiResponse<T> {
    return {
      succeeded: result.succeeded,
      data: result.data,
      message: result.message,
      errors: result.errors || [],
      statusCode: result.statusCode,
      timestamp: new Date().toISOString()
    };
  }

  // Convert ApiResult with pagination to PaginatedApiResponse
  private convertToPaginatedApiResponse<T>(result: ApiResult<any>): PaginatedApiResponse<T> {
    return {
      succeeded: result.succeeded,
      data: result.data,
      message: result.message,
      errors: result.errors || [],
      statusCode: result.statusCode,
      timestamp: new Date().toISOString()
    };
  }

  // ============================================================================
  // BULK CONTENT MODERATION OPERATIONS
  // ============================================================================

  /**
   * Bulk delete questions using existing content management patterns
   */
  async bulkDeleteQuestions(questionIds: string[], reason?: string): Promise<ApiResponse<void>> {
    const request: BulkModerationRequest = {
      action: 'delete',
      contentIds: questionIds,
      reason: reason || 'Bulk deletion',
      contentType: 'Question'
    };

    const result = await this.post<void>('/api/v7/qa/moderation/bulk', request);
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk delete answers using existing content management patterns
   */
  async bulkDeleteAnswers(answerIds: string[], reason?: string): Promise<ApiResponse<void>> {
    const request: BulkModerationRequest = {
      action: 'delete',
      contentIds: answerIds,
      reason: reason || 'Bulk deletion',
      contentType: 'Answer'
    };

    const result = await this.post<void>('/api/v7/qa/moderation/bulk', request);
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk close questions using existing content management patterns
   */
  async bulkCloseQuestions(questionIds: string[], reason: string): Promise<ApiResponse<void>> {
    const request: BulkModerationRequest = {
      action: 'close',
      contentIds: questionIds,
      reason,
      contentType: 'Question'
    };

    const result = await this.post<void>('/api/v7/qa/moderation/bulk', request);
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk flag content using existing content management patterns
   */
  async bulkFlagContent(
    contentIds: string[], 
    contentType: 'Question' | 'Answer', 
    reason: string
  ): Promise<ApiResponse<void>> {
    const request: BulkModerationRequest = {
      action: 'flag',
      contentIds,
      reason,
      contentType
    };

    const result = await this.post<void>('/api/v7/qa/moderation/bulk', request);
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk approve flagged content
   */
  async bulkApproveContent(
    contentIds: string[], 
    contentType: 'Question' | 'Answer'
  ): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-approve', {
      contentIds,
      contentType
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk move questions to different categories
   */
  async bulkMoveQuestions(questionIds: string[], newCategory: string): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-move', {
      questionIds,
      newCategory
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk update question tags
   */
  async bulkUpdateQuestionTags(
    questionIds: string[], 
    tagsToAdd: string[], 
    tagsToRemove: string[]
  ): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-tags', {
      questionIds,
      tagsToAdd,
      tagsToRemove
    });
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // BULK USER MANAGEMENT OPERATIONS
  // ============================================================================

  /**
   * Bulk adjust user reputation using existing user management patterns
   */
  async bulkAdjustUserReputation(
    userIds: string[], 
    adjustment: number, 
    reason: string
  ): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-reputation', {
      userIds,
      adjustment,
      reason
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk award badges using existing user management patterns
   */
  async bulkAwardBadges(userIds: string[], badgeType: string): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-badges', {
      userIds,
      badgeType
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk ban users using existing user management patterns
   */
  async bulkBanUsers(
    userIds: string[], 
    duration: number, 
    reason: string
  ): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-ban', {
      userIds,
      duration,
      reason
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk unban users using existing user management patterns
   */
  async bulkUnbanUsers(userIds: string[]): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-unban', {
      userIds
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk reset user passwords (admin function)
   */
  async bulkResetUserPasswords(userIds: string[]): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-password-reset', {
      userIds
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk update user roles
   */
  async bulkUpdateUserRoles(
    userIds: string[], 
    rolesToAdd: string[], 
    rolesToRemove: string[]
  ): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-roles', {
      userIds,
      rolesToAdd,
      rolesToRemove
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Bulk update user expertise areas
   */
  async bulkUpdateUserExpertise(
    userIds: string[], 
    expertiseAreas: string[]
  ): Promise<ApiResponse<void>> {
    const result = await this.post<void>('/api/v7/qa/moderation/bulk-expertise', {
      userIds,
      expertiseAreas
    });
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // BULK DATA EXPORT OPERATIONS
  // ============================================================================

  /**
   * Export content data using existing reporting infrastructure
   */
  async exportContentData(
    contentIds?: string[],
    contentType?: 'Question' | 'Answer',
    format: 'csv' | 'json' | 'xlsx' = 'json',
    includeFullContent: boolean = false
  ): Promise<ApiResponse<Blob>> {
    const params: Record<string, any> = {
      format,
      includeFullContent
    };

    if (contentIds && contentIds.length > 0) {
      params.contentIds = contentIds;
    }

    if (contentType) {
      params.contentType = contentType;
    }

    const queryString = this.buildQueryString(params);
    const endpoint = `/api/v7/qa/export/content?${queryString}`;

    const result = await this.get<Blob>(endpoint, {
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 
                 format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                 'application/json'
      }
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Export user data using existing reporting infrastructure
   */
  async exportUserData(
    userIds?: string[],
    format: 'csv' | 'json' | 'xlsx' = 'json',
    includeReputationHistory: boolean = false,
    includeModerationHistory: boolean = false
  ): Promise<ApiResponse<Blob>> {
    const params: Record<string, any> = {
      format,
      includeReputationHistory,
      includeModerationHistory
    };

    if (userIds && userIds.length > 0) {
      params.userIds = userIds;
    }

    const queryString = this.buildQueryString(params);
    const endpoint = `/api/v7/qa/export/users?${queryString}`;

    const result = await this.get<Blob>(endpoint, {
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 
                 format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                 'application/json'
      }
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Export moderation actions using existing reporting infrastructure
   */
  async exportModerationActions(
    dateFrom?: string,
    dateTo?: string,
    moderatorId?: string,
    format: 'csv' | 'json' | 'xlsx' = 'json'
  ): Promise<ApiResponse<Blob>> {
    const params: Record<string, any> = { format };

    if (dateFrom) params.dateFrom = dateFrom;
    if (dateTo) params.dateTo = dateTo;
    if (moderatorId) params.moderatorId = moderatorId;

    const queryString = this.buildQueryString(params);
    const endpoint = `/api/v7/qa/export/moderation-actions?${queryString}`;

    const result = await this.get<Blob>(endpoint, {
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 
                 format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                 'application/json'
      }
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Export analytics data using existing reporting infrastructure
   */
  async exportAnalyticsData(
    dateFrom: string,
    dateTo: string,
    format: 'csv' | 'json' | 'xlsx' = 'json'
  ): Promise<ApiResponse<Blob>> {
    const params = {
      dateFrom,
      dateTo,
      format
    };

    const queryString = this.buildQueryString(params);
    const endpoint = `/api/v7/qa/export/analytics?${queryString}`;

    const result = await this.get<Blob>(endpoint, {
      headers: {
        'Accept': format === 'csv' ? 'text/csv' : 
                 format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
                 'application/json'
      }
    });
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // BULK IMPORT OPERATIONS
  // ============================================================================

  /**
   * Import content from file using existing content management patterns
   */
  async importContentFromFile(
    file: File,
    contentType: 'Question' | 'Answer',
    validateOnly: boolean = false
  ): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contentType', contentType);
    formData.append('validateOnly', validateOnly.toString());

    const result = await this.postWithProgress<{ imported: number; errors: string[] }>(
      '/api/v7/qa/import/content',
      formData
    );
    return this.convertToApiResponse(result);
  }

  /**
   * Import user data from file using existing user management patterns
   */
  async importUserDataFromFile(
    file: File,
    validateOnly: boolean = false
  ): Promise<ApiResponse<{ imported: number; errors: string[] }>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('validateOnly', validateOnly.toString());

    const result = await this.postWithProgress<{ imported: number; errors: string[] }>(
      '/api/v7/qa/import/users',
      formData
    );
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // BATCH PROCESSING STATUS AND MONITORING
  // ============================================================================

  /**
   * Get batch operation status
   */
  async getBatchOperationStatus(operationId: string): Promise<ApiResponse<{
    id: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress: number;
    totalItems: number;
    processedItems: number;
    failedItems: number;
    errors: string[];
    startedAt: string;
    completedAt?: string;
  }>> {
    const result = await this.get<any>(`/api/v7/qa/batch-operations/${operationId}`);
    return this.convertToApiResponse(result);
  }

  /**
   * Get all batch operations for current user
   */
  async getBatchOperations(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedApiResponse<any>> {
    const params = { pageNumber, pageSize };
    const queryString = this.buildQueryString(params);
    const endpoint = `/api/v7/qa/batch-operations?${queryString}`;

    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse(result);
  }

  /**
   * Cancel a running batch operation
   */
  async cancelBatchOperation(operationId: string): Promise<ApiResponse<void>> {
    const result = await this.post<void>(`/api/v7/qa/batch-operations/${operationId}/cancel`, {});
    return this.convertToApiResponse(result);
  }

  // ============================================================================
  // UTILITY METHODS FOR BULK OPERATIONS
  // ============================================================================

  /**
   * Validate bulk operation request before execution
   */
  validateBulkRequest(
    itemIds: string[],
    maxBatchSize: number = 100
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!itemIds || itemIds.length === 0) {
      errors.push('No items selected for bulk operation');
    }

    if (itemIds.length > maxBatchSize) {
      errors.push(`Bulk operation limited to ${maxBatchSize} items. Selected: ${itemIds.length}`);
    }

    // Check for duplicate IDs
    const uniqueIds = new Set(itemIds);
    if (uniqueIds.size !== itemIds.length) {
      errors.push('Duplicate items detected in selection');
    }

    // Validate ID format (assuming GUID format)
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const invalidIds = itemIds.filter(id => !guidRegex.test(id));
    if (invalidIds.length > 0) {
      errors.push(`Invalid ID format detected: ${invalidIds.slice(0, 3).join(', ')}${invalidIds.length > 3 ? '...' : ''}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Split large bulk operations into smaller batches
   */
  splitIntoBatches<T>(items: T[], batchSize: number = 50): T[][] {
    const batches: T[][] = [];
    for (let i = 0; i < items.length; i += batchSize) {
      batches.push(items.slice(i, i + batchSize));
    }
    return batches;
  }

  /**
   * Execute bulk operation with progress tracking
   */
  async executeBulkOperationWithProgress(
    items: string[],
    operation: (batch: string[]) => Promise<void>,
    batchSize: number = 50,
    onProgress?: (progress: { completed: number; total: number; percentage: number }) => void
  ): Promise<{ success: boolean; completed: number; failed: number; errors: string[] }> {
    const batches = this.splitIntoBatches(items, batchSize);
    let completed = 0;
    let failed = 0;
    const errors: string[] = [];

    for (let i = 0; i < batches.length; i++) {
      try {
        await operation(batches[i]);
        completed += batches[i].length;
      } catch (error) {
        failed += batches[i].length;
        errors.push(`Batch ${i + 1} failed: ${error}`);
      }

      // Report progress
      if (onProgress) {
        const totalProcessed = completed + failed;
        onProgress({
          completed: totalProcessed,
          total: items.length,
          percentage: Math.round((totalProcessed / items.length) * 100)
        });
      }
    }

    return {
      success: failed === 0,
      completed,
      failed,
      errors
    };
  }

  /**
   * Generate bulk operation summary report
   */
  generateOperationSummary(
    operation: string,
    itemCount: number,
    successCount: number,
    failureCount: number,
    errors: string[] = []
  ): string {
    const successRate = itemCount > 0 ? Math.round((successCount / itemCount) * 100) : 0;
    
    let summary = `Bulk ${operation} Operation Summary:\n`;
    summary += `Total Items: ${itemCount}\n`;
    summary += `Successful: ${successCount}\n`;
    summary += `Failed: ${failureCount}\n`;
    summary += `Success Rate: ${successRate}%\n`;
    
    if (errors.length > 0) {
      summary += `\nErrors:\n`;
      errors.slice(0, 5).forEach((error, index) => {
        summary += `${index + 1}. ${error}\n`;
      });
      if (errors.length > 5) {
        summary += `... and ${errors.length - 5} more errors\n`;
      }
    }
    
    return summary;
  }

  /**
   * Error handling helpers following existing patterns
   */
  async withBulkErrorHandling<T>(
    operation: () => Promise<ApiResponse<T>>
  ): Promise<T> {
    try {
      const result = await operation();
      if (result.succeeded && result.data !== undefined) {
        return result.data;
      }
      throw new Error(result.message || result.errors?.[0] || 'Bulk operation failed');
    } catch (error) {
      this.handleApiError(error);
      throw error;
    }
  }
}

// Export singleton instance following existing patterns
export const bulkOperationsService = new BulkOperationsService();