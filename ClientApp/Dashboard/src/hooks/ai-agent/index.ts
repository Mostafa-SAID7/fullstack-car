// AI Agent Hook - Main Export (composed from sub-modules)

import { useAIAgentState } from './state';
import { useAIAgentConfig } from './config';
import { useAIAgentTraining } from './training';
import { useAIAgentEffects } from './effects';

export const useAIAgent = () => {
  const {
    config,
    isTraining,
    activeTab,
    metrics,
    trainingSessions,
    setConfig,
    setIsTraining,
    setActiveTab
  } = useAIAgentState();

  const { updateConfig, toggleAIAgent } = useAIAgentConfig(setConfig, config);

  const { startTraining, stopTraining } = useAIAgentTraining(setIsTraining);

  // Initialize effects
  useAIAgentEffects(config);

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
