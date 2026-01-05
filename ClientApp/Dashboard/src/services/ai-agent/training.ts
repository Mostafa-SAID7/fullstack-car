// AI Agent Service - Training Management

import { apiClient } from '../api';

export class AIAgentTrainingService {
  async getAgentStatus() {
    const response = await apiClient.get('/ai/status');
    return response;
  }

  async trainAgent(data: any) {
    const response = await apiClient.post('/ai/train', data);
    return response;
  }

  async getTrainingStatus(trainingId: string) {
    const response = await apiClient.get(`/ai/training/${trainingId}`);
    return response;
  }

  async stopTraining(trainingId: string) {
    const response = await apiClient.post(`/ai/training/${trainingId}/stop`);
    return response;
  }
}



