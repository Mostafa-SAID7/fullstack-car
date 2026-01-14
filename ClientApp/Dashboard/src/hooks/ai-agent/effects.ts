// AI Agent Hook - Effects

import { useEffect } from 'react';
import type { AIAgentConfig } from '../../types/config';

export const useAIAgentEffects = (config: AIAgentConfig) => {
  // Save config changes
  useEffect(() => {
    localStorage.setItem('ai_agent_config', JSON.stringify(config));
  }, [config]);

  return {};
};





