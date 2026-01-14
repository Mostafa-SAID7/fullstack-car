// AI Agent Hook - Training Control Functions

export const useAIAgentTraining = (
  setIsTraining: (training: boolean) => void
) => {
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
    startTraining,
    stopTraining
  };
};





