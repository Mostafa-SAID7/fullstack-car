import { useState, useCallback } from 'react';
import type { TrainingProgress, ModelConfig, SystemMetrics } from '../types';

export const useTraining = () => {
  const [trainingProgress, setTrainingProgress] = useState<TrainingProgress>({
    epoch: 0,
    totalEpochs: 3,
    loss: 0,
    accuracy: 0,
    timeElapsed: '00:00:00',
    estimatedTimeRemaining: 'Calculating...',
    status: 'idle'
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 45,
    memoryUsage: 62,
    gpuUsage: 0,
    diskUsage: 78
  });

  const [logs, setLogs] = useState<string[]>([
    '[INFO] System initialized',
    '[INFO] Model configuration loaded',
    '[INFO] Dataset validation completed',
    '[INFO] Ready to start training...'
  ]);

  const addLog = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`].slice(-50));
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const simulateTraining = useCallback((modelConfig: ModelConfig) => {
    let currentEpoch = 0;
    const interval = setInterval(() => {
      if (currentEpoch >= modelConfig.epochs) {
        setTrainingProgress(prev => ({ ...prev, status: 'completed' }));
        addLog('[SUCCESS] Training completed successfully!');
        clearInterval(interval);
        return;
      }

      currentEpoch++;
      const loss = Math.max(0.1, 2.5 - (currentEpoch * 0.8) + (Math.random() * 0.2));
      const accuracy = Math.min(0.95, 0.3 + (currentEpoch * 0.2) + (Math.random() * 0.1));

      setTrainingProgress(prev => ({
        ...prev,
        epoch: currentEpoch,
        loss: parseFloat(loss.toFixed(4)),
        accuracy: parseFloat(accuracy.toFixed(4)),
        timeElapsed: formatTime(currentEpoch * 45),
        estimatedTimeRemaining: formatTime((modelConfig.epochs - currentEpoch) * 45)
      }));

      addLog(`[INFO] Epoch ${currentEpoch}/${modelConfig.epochs} - Loss: ${loss.toFixed(4)}, Accuracy: ${(accuracy * 100).toFixed(2)}%`);

      // Update system metrics
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.min(95, 60 + Math.random() * 20),
        memoryUsage: Math.min(90, 70 + Math.random() * 15),
        gpuUsage: Math.min(85, 40 + Math.random() * 30)
      }));
    }, 3000);

    return interval;
  }, [addLog, formatTime]);

  const startTraining = useCallback((modelConfig: ModelConfig) => {
    setTrainingProgress(prev => ({ ...prev, status: 'training' }));
    addLog('[INFO] Training started...');
    addLog(`[INFO] Using model: ${modelConfig.baseModel}`);
    addLog(`[INFO] Dataset: ${modelConfig.dataset}`);
    addLog(`[INFO] Epochs: ${modelConfig.epochs}`);
    
    return simulateTraining(modelConfig);
  }, [addLog, simulateTraining]);

  const pauseTraining = useCallback(() => {
    setTrainingProgress(prev => ({ ...prev, status: 'paused' }));
    addLog('[WARN] Training paused by user');
  }, [addLog]);

  const stopTraining = useCallback(() => {
    setTrainingProgress(prev => ({ 
      ...prev, 
      status: 'idle',
      epoch: 0,
      loss: 0,
      accuracy: 0 
    }));
    addLog('[INFO] Training stopped by user');
  }, [addLog]);

  return {
    trainingProgress,
    systemMetrics,
    logs,
    startTraining,
    pauseTraining,
    stopTraining,
    addLog
  };
};