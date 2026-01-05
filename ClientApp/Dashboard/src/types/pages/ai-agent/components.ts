// AI Agent Page Component Props Types

import type { ModelMetrics } from '../../monitoring';

export interface AIAgentOverviewProps {
  isAIEnabled: boolean;
  metrics: ModelMetrics;
}

export interface AIAgentSettingsProps {
  config: import('../../config').AIAgentConfig;
  onConfigUpdate: (config: import('../../config').AIAgentConfig) => void;
}

export interface AIAgentTrainingProps {
  trainingSessions: import('../../training').TrainingSession[];
  isTraining: boolean;
  onStartTraining: () => void;
  onStopTraining: () => void;
}

export interface AIAgentModelsProps {
  config: import('../../config').AIAgentConfig;
  onConfigUpdate: (config: import('../../config').AIAgentConfig) => void;
}
