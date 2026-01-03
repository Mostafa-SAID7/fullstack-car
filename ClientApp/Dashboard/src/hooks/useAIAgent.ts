import { useState, useEffect } from 'react';
import type { AIAgentConfig } from '../types/config';
import type { ModelMetrics } from '../types/monitoring';
import type { TrainingSession } from '../types/training';

export const useAIAgent = () => {
  // State management
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
  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'models' | 'monitoring' | 'datasets' | 'settings'>('overview');

  // Mock data - in real app, this would come from API
  const [metrics] = useState<ModelMetrics>({
    accuracy: 94.2,
    responseTime: 1.2,
    throughput: 150,
    errorRate: 2.1,
    memoryUsage: 68,
    cpuUsage: 45,
    networkIO: 12.5
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

  // Save config changes
  useEffect(() => {
    localStorage.setItem('ai_agent_config', JSON.stringify(config));
  }, [config]);

  // Update config
  const updateConfig = (updates: Partial<AIAgentConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  // Toggle AI agent
  const toggleAIAgent = () => {
    updateConfig({ isEnabled: !config.isEnabled });
  };

  // Training controls
  const startTraining = () => {
    setIsTraining(true);
    // In real app, make API call to start training
  };

  const stopTraining = () => {
    setIsTraining(false);
    // In real app, make API call to stop training
  };

  return {
    config,
    updateConfig,
    toggleAIAgent,
    metrics,
    trainingSessions,
    isTraining,
    startTraining,
    stopTraining,
    activeTab,
    setActiveTab
  };
};