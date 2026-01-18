import { ApiService } from '../../../../services/api/ApiService';
import type { ApiResult } from '../../../../types/api';
import type {
  ApiResponse,
  PaginatedApiResponse,
  UserReputation,
  ReputationHistory,
  Expert
} from '../types/api-types';
import { QA_API_ENDPOINTS } from '../types/api-types';

/**
 * Reputation Service following existing service patterns
 * Provides reputation and expert system functionality for React Dashboard
 * Extends ApiService for consistent error handling and HTTP patterns
 */
export class ReputationService extends ApiService {

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

  /**
   * Get user reputation details
   */
  async getUserReputation(userId: string): Promise<ApiResponse<UserReputation>> {
    const result = await this.get<UserReputation>(`${QA_API_ENDPOINTS.REPUTATION.BASE}/${userId}`);
    return this.convertToApiResponse(result);
  }

  /**
   * Get reputation leaderboard
   */
  async getReputationLeaderboard(
    pageNumber: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedApiResponse<UserReputation>> {
    const params = { pageNumber, pageSize };
    const queryString = this.buildQueryString(params);
    const endpoint = `${QA_API_ENDPOINTS.REPUTATION.LEADERBOARD}?${queryString}`;

    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse(result);
  }

  /**
   * Get reputation history for a user
   */
  async getReputationHistory(
    userId: string,
    pageNumber: number = 1,
    pageSize: number = 20
  ): Promise<PaginatedApiResponse<ReputationHistory>> {
    const params = { pageNumber, pageSize };
    const queryString = this.buildQueryString(params);
    const endpoint = `${QA_API_ENDPOINTS.REPUTATION.HISTORY(userId)}?${queryString}`;

    const result = await this.get<any>(endpoint);
    return this.convertToPaginatedApiResponse(result);
  }

  /**
   * Adjust user reputation (admin function)
   */
  async adjustUserReputation(
    userId: string,
    adjustment: number,
    reason: string
  ): Promise<ApiResponse<void>> {
    const result = await this.post<void>(`${QA_API_ENDPOINTS.REPUTATION.BASE}/adjust`, {
      userId,
      adjustment,
      reason
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Award badge to user
   */
  async awardBadge(userId: string, badgeType: string): Promise<ApiResponse<void>> {
    const result = await this.post<void>(`${QA_API_ENDPOINTS.REPUTATION.BASE}/award-badge`, {
      userId,
      badgeType
    });
    return this.convertToApiResponse(result);
  }

  /**
   * Get experts in a category
   */
  async getExperts(category?: string): Promise<ApiResponse<Expert[]>> {
    const params = category ? { category } : {};
    const queryString = this.buildQueryString(params);
    const endpoint = `${QA_API_ENDPOINTS.REPUTATION.EXPERTS}?${queryString}`;

    const result = await this.get<Expert[]>(endpoint);
    return this.convertToApiResponse(result);
  }
}

// Export singleton instance following existing patterns
export const reputationService = new ReputationService();