// Training Progress Component - Display training session details and metrics

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Square, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';
import { trainingService } from '../../../services/ai-agent';
import type { TrainingJob, TrainingMetrics } from '../../../types/ai-agent';

interface TrainingProgressProps {
  session: TrainingJob;
  onClose: () => void;
  onStop: () => void;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  session,
  onClose,
  onStop
}) => {
  const [metrics, setMetrics] = useState<TrainingMetrics | null>(session.metrics || null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session.status === 'running') {
      loadMetrics();
      loadLogs();
      
      // Auto-refresh every 2 seconds for running sessions
      const interval = setInterval(() => {
        loadMetrics();
        loadLogs();
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      loadMetrics();
      loadLogs();
    }
  }, [session.id, session.status]);

  const loadMetrics = async () => {
    try {
      const data = await trainingService.getTrainingMetrics(session.id);
      setMetrics(data);
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const data = await trainingService.getTrainingLogs(session.id, { limit: 10 });
      setLogs(data);
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return 'N/A';
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getLatestMetric = (arr?: number[]) => {
    if (!arr || arr.length === 0) return 'N/A';
    return arr[arr.length - 1].toFixed(4);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-card border border-border/50 rounded-2xl overflow-hidden flex flex-col max-h-[600px]"
    >
      {/* Header */}
      <div className="p-6 border-b border-border/50 bg-muted/30">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold truncate">{session.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                session.status === 'running' ? 'bg-blue-500/10 text-blue-600' :
                session.status === 'completed' ? 'bg-green-500/10 text-green-600' :
                session.status === 'failed' ? 'bg-red-500/10 text-red-600' :
                'bg-yellow-500/10 text-yellow-600'
              } capitalize font-medium`}>
                {session.status}
              </span>
              {session.status === 'running' && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded-full">
                  <Activity className="w-3 h-3 text-blue-500 animate-pulse" />
                  <span className="text-xs text-blue-600 font-medium">
                    {Math.round(session.progress)}%
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {session.status === 'running' && (
              <button
                onClick={onStop}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                title="Stop Training"
              >
                <Square className="w-5 h-5 text-red-500" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {session.status === 'running' && (
          <div className="mb-4">
            <div className="h-3 bg-background rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300"
                style={{ width: `${session.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Session Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Started</p>
            <p className="font-medium">{new Date(session.startedAt).toLocaleString()}</p>
          </div>
          {session.completedAt && (
            <div>
              <p className="text-muted-foreground mb-1">Completed</p>
              <p className="font-medium">{new Date(session.completedAt).toLocaleString()}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground mb-1">Duration</p>
            <p className="font-medium">{formatDuration(session.duration)}</p>
          </div>
          {session.config && (
            <div>
              <p className="text-muted-foreground mb-1">Epochs</p>
              <p className="font-medium">{session.config.epochs}</p>
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-semibold mb-4">Training Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-blue-500" />
                <p className="text-sm text-muted-foreground">Loss</p>
              </div>
              <p className="text-2xl font-bold">{getLatestMetric(metrics.loss)}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <p className="text-2xl font-bold">{getLatestMetric(metrics.accuracy)}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-4 h-4 text-purple-500" />
                <p className="text-sm text-muted-foreground">Val Loss</p>
              </div>
              <p className="text-2xl font-bold">{getLatestMetric(metrics.validationLoss)}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-orange-500" />
                <p className="text-sm text-muted-foreground">Val Accuracy</p>
              </div>
              <p className="text-2xl font-bold">{getLatestMetric(metrics.validationAccuracy)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Configuration */}
      {session.config && (
        <div className="p-6 border-b border-border/50">
          <h3 className="text-lg font-semibold mb-4">Configuration</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Dataset</p>
              <p className="font-medium">{session.config.datasetId}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Batch Size</p>
              <p className="font-medium">{session.config.batchSize}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Learning Rate</p>
              <p className="font-medium">{session.config.learningRate}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Validation Split</p>
              <p className="font-medium">{(session.config.validationSplit * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Logs */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Logs</h3>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No logs available</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`text-xs p-2 rounded-lg ${
                  log.level === 'error' ? 'bg-red-500/10 text-red-600' :
                  log.level === 'warning' ? 'bg-yellow-500/10 text-yellow-600' :
                  'bg-muted text-muted-foreground'
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="font-mono opacity-70">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className="flex-1">{log.message}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};
