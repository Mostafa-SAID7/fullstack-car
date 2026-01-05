// AI Agent Hook - Config Management Functions

import type { AIAgentConfig } from '../../types/config';

export const useAIAgentConfig = (
  setConfig: (config: AIAgentConfig) => void,
  config: AIAgentConfig
) => {
  // Update config
  const updateConfig = (updates: Partial<AIAgentConfig>) => {
    setConfig({ ...config, ...updates });
  };

  // Toggle AI agent
  const toggleAIAgent = () => {
    updateConfig({ isEnabled: !config.isEnabled });
  };

  return {
    updateConfig,
    toggleAIAgent
  };
};
