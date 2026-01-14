// AI Agent Service - Knowledge Base Management

import { apiClient } from '../api';

export class AIAgentKnowledgeService {
  async uploadKnowledge(file: File, metadata?: any) {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiClient.post('/ai/knowledge/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response as any;
  }

  async getKnowledgeBase() {
    const response = await apiClient.get('/ai/knowledge');
    return response as any;
  }

  async deleteKnowledge(knowledgeId: string) {
    const response = await apiClient.delete(`/ai/knowledge/${knowledgeId}`);
    return response as any;
  }
}






