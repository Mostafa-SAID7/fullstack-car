// AI Agent Hook - State Management

import { useState } from 'react';
import type { AIAgentConfig } from '../../types/config';
import type { ModelMetrics } from '../../types/models';
import type { TrainingSession } from '../../types/training';

export const useAIAgentState = () => {
  const [config, setConfig] = useState<AIAgentConfig>(() => {
    const saved = localStorage.getItem('ai_agent_config');
    return saved ? JSON.parse(saved) : {
      temperature: 0.7,
      maxTokens: 150,
      topP: 0.9,
      topK: 50,
      isEnabled: true,
      autoLearning: true,
      debugMode: false,
      apiEndpoint: 'http://localhost:8002',
      rateLimit: 100,
      timeout: 30
    };
  });

  const [isTraining, setIsTraining] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Mock data - in real app, this would come from API
  const [metrics] = useState<ModelMetrics>({
    accuracy: 94.2,
    responseTime: 1.2,
    throughput: 150,
    errorRate: 2.1,
    memoryUsage: 68,
    cpuUsage: 45,
    uptime: 99.8,
    requestsPerMinute: 150
  });

  const [trainingSessions] = useState<TrainingSession[]>([
    {
      id: '1',
      name: 'Car Knowledge Base Training',
      status: 'running',
      progress: 67,
      startTime: '2024-01-03 14:30',
      duration: '2h 15m',
      accuracy: 0.89,
      loss: 0.23,
      datasetSize: 15000,
      createdAt: '2024-01-03T14:30:00Z',
      updatedAt: '2024-01-03T16:45:00Z'
    },
    {
      id: '2',
      name: 'Customer Service Fine-tuning',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-02 09:00',
      duration: '4h 32m',
      accuracy: 0.94,
      loss: 0.12,
      datasetSize: 25000,
      createdAt: '2024-01-02T09:00:00Z',
      updatedAt: '2024-01-02T13:32:00Z'
    },
    {
      id: '3',
      name: 'Maintenance Recommendations',
      status: 'failed',
      progress: 45,
      startTime: '2024-01-01 16:20',
      duration: '1h 45m',
      accuracy: 0.76,
      loss: 0.45,
      datasetSize: 8000,
      createdAt: '2024-01-01T16:20:00Z',
      updatedAt: '2024-01-01T18:05:00Z'
    }
  ]);

  return {
    config,
    isTraining,
    activeTab,
    metrics,
    trainingSessions,
    setConfig,
    setIsTraining,
    setActiveTab
  };
};







