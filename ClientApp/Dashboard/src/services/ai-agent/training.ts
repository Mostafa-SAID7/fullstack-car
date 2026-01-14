// AI Agent Training Service - Training Management

import { apiClient } from '../api';
import type { TrainingJob, TrainingConfig, TrainingMetrics } from '../../types/ai-agent';

interface StartTrainingRequest {
  name: string;
  modelId?: string;
  config: TrainingConfig;
}

interface TrainingListResponse {
  sessions: TrainingJob[];
  total: number;
}

export class AIAgentTrainingService {
  // List all training sessions
  async listTrainingSessions(params?: { limit?: number; offset?: number; status?: string }): Promise<TrainingListResponse> {
    const response = await apiClient.get('/ai/training', { params });
    return response as any as TrainingListResponse;
  }

  // Get specific training session
  async getTrainingSession(trainingId: string): Promise<TrainingJob> {
    const response = await apiClient.get(`/ai/training/${trainingId}`);
    return response as any as TrainingJob;
  }

  // Start new training session
  async startTraining(data: StartTrainingRequest): Promise<TrainingJob> {
    const response = await apiClient.post('/ai/training/start', data);
    return response as any as TrainingJob;
  }

  // Stop training session
  async stopTraining(trainingId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/ai/training/${trainingId}/stop`);
    return response as any as { success: boolean; message: string };
  }

  // Get training metrics
  async getTrainingMetrics(trainingId: string): Promise<TrainingMetrics> {
    const response = await apiClient.get(`/ai/training/${trainingId}/metrics`);
    return response as any as TrainingMetrics;
  }

  // Get training logs
  async getTrainingLogs(trainingId: string, params?: { limit?: number }): Promise<any[]> {
    const response = await apiClient.get(`/ai/training/${trainingId}/logs`, { params });
    return response as any as any[];
  }

  // Delete training session
  async deleteTrainingSession(trainingId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/ai/training/${trainingId}`);
    return response as any as { success: boolean };
  }

  // Get agent status
  async getAgentStatus(): Promise<any> {
    const response = await apiClient.get('/ai/status');
    return response as any;
  }
}

export const trainingService = new AIAgentTrainingService();
