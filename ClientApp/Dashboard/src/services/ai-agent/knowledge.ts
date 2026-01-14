// Knowledge Base Service - For managing knowledge entries

import { apiClient } from '../api';
import type { KnowledgeEntry, KnowledgeCategory } from '../../types/ai-agent';

const BASE_URL = '/api/knowledge';

export interface KnowledgeSearchParams {
  query?: string;
  category?: KnowledgeCategory;
  verified?: boolean;
  limit?: number;
}

export interface KnowledgeStats {
  total: number;
  verified: number;
  byCategory: Record<string, number>;
}

export class KnowledgeService {
  /**
   * Search knowledge entries
   */
  async search(params: KnowledgeSearchParams): Promise<{ results: KnowledgeEntry[] }> {
    const response = await apiClient.get(BASE_URL + '/search', { params });
    return response.data as { results: KnowledgeEntry[] };
  }

  /**
   * Add a new knowledge entry
   */
  async addEntry(data: {
    content: string;
    category: KnowledgeCategory;
    source: string;
    metadata?: Record<string, any>;
  }): Promise<KnowledgeEntry> {
    const response = await apiClient.post(BASE_URL, data);
    return response.data as KnowledgeEntry;
  }

  /**
   * Update an existing knowledge entry
   */
  async updateEntry(id: string, data: {
    content?: string;
    category?: KnowledgeCategory;
    metadata?: Record<string, any>;
  }): Promise<KnowledgeEntry> {
    const response = await apiClient.put(`${BASE_URL}/${id}`, data);
    return response.data as KnowledgeEntry;
  }

  /**
   * Delete a knowledge entry
   */
  async deleteEntry(id: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/${id}`);
  }

  /**
   * Upload a document
   */
  async uploadDocument(file: File, category: KnowledgeCategory): Promise<KnowledgeEntry> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);

    const response = await apiClient.post(`${BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data as KnowledgeEntry;
  }

  /**
   * Bulk upload documents
   */
  async bulkUpload(files: File[], category: KnowledgeCategory): Promise<{ entries: KnowledgeEntry[] }> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('category', category);

    const response = await apiClient.post(`${BASE_URL}/upload/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data as { entries: KnowledgeEntry[] };
  }

  /**
   * Get knowledge base statistics
   */
  async getStats(): Promise<KnowledgeStats> {
    const response = await apiClient.get(`${BASE_URL}/stats`);
    return response.data as KnowledgeStats;
  }

  /**
   * Get categories list
   */
  async getCategories(): Promise<{ categories: string[] }> {
    const response = await apiClient.get(`${BASE_URL}/categories`);
    return response.data as { categories: string[] };
  }

  /**
   * Mark entry as verified
   */
  async verifyEntry(id: string): Promise<KnowledgeEntry> {
    const response = await apiClient.post(`${BASE_URL}/${id}/verify`);
    return response.data as KnowledgeEntry;
  }
}

export const knowledgeService = new KnowledgeService();

