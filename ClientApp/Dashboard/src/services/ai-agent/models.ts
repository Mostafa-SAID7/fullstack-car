// AI Agent Service - Model Management

import { apiClient } from '../api';

export class AIAgentModelsService {
  async getAvailableModels() {
    const response = await apiClient.get('/ai/models');
    return response;
  }

  async switchModel(modelId: string) {
    const response = await apiClient.post('/ai/models/switch', { modelId });
    return response;
  }

  async getModelMetrics(modelId?: string) {
    const url = modelId ? `/ai/models/${modelId}/metrics` : '/ai/models/metrics';
    const response = await apiClient.get(url);
    return response;
  }
}



